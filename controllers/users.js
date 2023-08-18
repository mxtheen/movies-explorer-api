const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { ValidationError } = mongoose.Error;
const { JWT_SECRET, NODE_ENV } = process.env;

const User = require('../models/user');
const { CREATED, DUBLICATE_KEY } = require('../utils/statusCode');
const {
  badRequestMessage, notFoundMessage, unauthorizedMessage, conflictMessage,
} = require('../utils/errMessages');
const BadRequestError = require('../utils/errors/BadRequestError');
const ConflictError = require('../utils/errors/ConflictError');
const UnauthorizedError = require('../utils/errors/UnauthorizedError');
const NotFoundError = require('../utils/errors/NotFoundError');

const registerUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name,
    }))
    .then((data) => {
      res.status(CREATED).send(data);
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequestError(badRequestMessage.user));
      } else if (err.code === DUBLICATE_KEY) {
        next(new ConflictError(conflictMessage.user));
      } else {
        next(err);
      }
    });
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return next(new UnauthorizedError(unauthorizedMessage.user));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return next(new UnauthorizedError(unauthorizedMessage.user));
          }
          const token = jwt.sign({ id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-key', { expiresIn: '7d' });
          return res.send({ token });
        });
    })
    .catch((err) => {
      next(err);
    });
};

const getCurrentUserData = (req, res, next) => {
  User.findById(req.user.id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        next(new NotFoundError(notFoundMessage.user));
      }
    })
    .catch((err) => {
      next(err);
    });
};

const updateUserData = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(req.user.id, { email, name }, { new: true, runValidators: true })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        next(new NotFoundError(notFoundMessage.user));
      }
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequestError(badRequestMessage.user));
      } else if (err.code === DUBLICATE_KEY) {
        next(new ConflictError(conflictMessage.user));
      } else {
        next(err);
      }
    });
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUserData,
  updateUserData,
};
