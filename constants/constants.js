const { constants } = require('http2');

module.exports = {
  HTTP_STATUS_OK: constants.HTTP_STATUS_OK,
  HTTP_STATUS_CREATED: constants.HTTP_STATUS_CREATED,
  HTTP_STATUS_BAD_REQUEST: constants.HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_UNAUTHORIZED: constants.HTTP_STATUS_UNAUTHORIZED,
  HTTP_STATUS_NOT_FOUND: constants.HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_FORBIDDEN: constants.HTTP_STATUS_FORBIDDEN,
  HTTP_STATUS_CONFLICT: constants.HTTP_STATUS_CONFLICT,
  linkRegExp: /^(http|https):\/\/(www\.)?[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=,]+#?$/,
};
