const router = require('express').Router();

const { validationCreateMovie, validationMovieId } = require('../middlewares/celebrate/movie');

const { createMovie, getMovies, deleteMovie } = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', validationCreateMovie, createMovie);
router.delete('/:movieId', validationMovieId, deleteMovie);

module.exports = router;
