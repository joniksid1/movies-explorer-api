const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
} = require('http2').constants;
const mongoose = require('mongoose');
const Movie = require('../models/movie');
const { NotFoundError } = require('../utils/errors/not-found-error');
const { CastError } = require('../utils/errors/cast-error');
const { ForbiddenError } = require('../utils/errors/forbidden-error');

module.exports.getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({});
    res.status(HTTP_STATUS_OK).send(movies);
  } catch (e) {
    next(e);
  }
};

module.exports.createMovie = async (req, res, next) => {
  try {
    const owner = req.user._id;
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

    // Создаем объект фильма на основе данных из запроса
    const movie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      owner,
      movieId,
      nameRU,
      nameEN,
    });

    res.status(HTTP_STATUS_CREATED).send(movie);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      next(new CastError({ message: e.message }));
    } else {
      next(e);
    }
  }
};

module.exports.deleteMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      throw new NotFoundError({ message: 'Фильм не найден' });
    } else if (movie.owner.toString() !== req.user._id) {
      throw new ForbiddenError({ message: 'Нельзя удалить фильм другого пользователя' });
    } else {
      await Movie.deleteOne(movie);
      res.send({ message: 'Фильм успешно удален' });
    }
  } catch (e) {
    if (e instanceof mongoose.Error.CastError) {
      next(new CastError({ message: e.message }));
    } else {
      next(e);
    }
  }
};
