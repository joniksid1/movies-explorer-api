const { Joi, celebrate } = require('celebrate');
const { linkRegExp } = require('../constants/constants');

const idSchema = Joi.string().required().alphanum().length(24);

const movieIdValidation = celebrate({
  params: Joi.object().keys({
    id: idSchema,
  }),
});

const movieDataValidation = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(linkRegExp),
    trailerLink: Joi.string().required().pattern(linkRegExp),
    thumbnail: Joi.string().required().pattern(linkRegExp),
    owner: Joi.string().required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

module.exports = {
  movieIdValidation,
  movieDataValidation,
};
