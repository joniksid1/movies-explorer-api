const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { UnauthorizedError } = require('../utils/errors/unauthorized-error');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Михаил',
      minlength: [2, 'Минимальная длина 2 символа'],
      maxlength: [30, 'Максимальная длина 30 символов'],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: 'Некорректный формат email',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
    // При get /users пароль тоже скрывается
    toJSON: {
      transform(doc, ret) {
        const { password, ...userWithoutPassword } = ret;
        return userWithoutPassword;
      },
    },
  },
);

userSchema.statics.findUserByCredentials = async function (email, password) {
  try {
    const user = await this.findOne({ email }).select('+password');

    if (!user) {
      throw new UnauthorizedError({ message: 'Неправильные почта или пароль' });
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      throw new UnauthorizedError({ message: 'Неправильные почта или пароль' });
    }

    return user;
  } catch (e) {
    throw new UnauthorizedError({ message: 'Неправильные почта или пароль' });
  }
};

module.exports = mongoose.model('user', userSchema);
