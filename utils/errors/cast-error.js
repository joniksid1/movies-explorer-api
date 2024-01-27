const {
  HTTP_STATUS_BAD_REQUEST,
} = require('../../constants/constants');

class CastError extends Error {
  constructor({ message }) {
    super(message);
    this.statusCode = HTTP_STATUS_BAD_REQUEST;
  }
}

module.exports = { CastError };
