const mongoose = require('mongoose');

const { ValidationError, CastError } = mongoose.Error;

const Movie = require('../models/movie');

const { CREATED } = require('../utils/statusCode');
const { badRequestMessage, notFoundMessage, forbiddenMessage } = require('../utils/errMessages');

const BadRequestError = require('../utils/errors/BadRequestError');
const NotFoundError = require('../utils/errors/NotFoundError');
const ForbiddenError = require('../utils/errors/ForbiddenError');

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner: req.user.id,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => {
      res.status(CREATED).send(movie);
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequestError(badRequestMessage.movie));
      } else {
        next(err);
      }
    });
};

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user.id })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(movieId)
    .then((data) => {
      if (!data) {
        return next(new NotFoundError(notFoundMessage.movie));
      }
      if (!data.owner.equals(req.user.id)) {
        return next(new ForbiddenError(forbiddenMessage.movie));
      }
      return Movie.findByIdAndRemove(movieId)
        .then((deletedData) => {
          res.send(deletedData);
        });
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError(badRequestMessage.movie));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createMovie,
  getMovies,
  deleteMovie,
};
