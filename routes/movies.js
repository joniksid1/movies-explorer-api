const movieRouter = require('express').Router();
const {
  getMovies, createMovie, deleteMovieById,
} = require('../controllers/movies');
const { movieIdValidation, movieDataValidation } = require('../middlewares/movie-validation');

movieRouter.get('/', getMovies);
movieRouter.post('/', movieDataValidation, createMovie);
movieRouter.delete('/:id', movieIdValidation, deleteMovieById);

module.exports = { movieRouter };
