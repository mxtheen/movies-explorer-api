/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');

const { JWT_SECRET, NODE_ENV } = process.env;
const UnauthorizedError = require('../utils/errors/UnauthorizedError');
const { unauthorizedMessage } = require('../utils/errMessages');

const extractBearerToken = (header) => header.replace('Bearer ', '');

const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError(unauthorizedMessage.auth));
  }
  const token = extractBearerToken(authorization);
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-key');
  } catch (err) {
    return next(new UnauthorizedError(unauthorizedMessage.auth));
  }

  req.user = payload;

  next();
};
module.exports = {
  authMiddleware,
};
