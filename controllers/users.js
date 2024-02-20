const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
} = require('../constants/constants');
const User = require('../models/user');
const { NotFoundError } = require('../utils/errors/not-found-error');
const { ConflictError } = require('../utils/errors/conflict-error');
const { CastError } = require('../utils/errors/cast-error');
const { updateUser } = require('../utils/update-user');

const { NODE_ENV = 'production', JWT_SECRET = 'some-secret-key' } = process.env;

module.exports.getCurrentUser = async (req, res, next) => {
  try {
    const currentUser = await User.findOne({ _id: req.user._id });
    res.send(currentUser);
  } catch (e) {
    if (e instanceof NotFoundError) {
      next(new NotFoundError({ message: 'Пользователь не найден' }));
    } else {
      next(e);
    }
  }
};

module.exports.createUser = async (req, res, next) => {
  try {
    const {
      name, email, password,
    } = req.body;

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hash,
      name,
    });
    res.status(HTTP_STATUS_CREATED).send(user);
  } catch (e) {
    if (e.code === 11000) {
      next(new ConflictError({ message: 'Пользователь уже существует' }));
    } else if (e instanceof mongoose.Error.ValidationError) {
      next(new CastError({ message: e.message }));
    } else {
      next(e);
    }
  }
};

module.exports.updateUserData = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const updatedUser = await updateUser(req.user._id, { name, email });
    res.status(HTTP_STATUS_OK).send(updatedUser);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      next(new CastError({ message: e.message }));
    } else {
      next(e);
    }
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      { expiresIn: '7d' },
    );

    res
      .cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      })
      .send(user.toJSON());
  } catch (e) {
    next(e);
  }
};

module.exports.signout = async (req, res, next) => {
  try {
    res.clearCookie('jwt');
    res.status(200).send({ message: 'Вы успешно вышли из системы' });
  } catch (e) {
    next(e);
  }
};
