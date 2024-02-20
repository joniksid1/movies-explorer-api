const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { UnauthorizedError } = require('../utils/errors/unauthorized-error');

const { NODE_ENV = 'production', JWT_SECRET = 'some-secret-key' } = process.env;

const parseCookie = cookieParser();

const auth = (req, res, next) => {
  parseCookie(req, res, () => {
    const { jwt: token } = req.cookies;

    if (!token) {
      next(new UnauthorizedError({ message: 'Необходима авторизация' }));
    } else {
      let payload;

      try {
        payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
      } catch (e) {
        next(new UnauthorizedError({ message: e.message }));
      }

      req.user = payload;

      next();
    }
  });
};

module.exports = auth;
