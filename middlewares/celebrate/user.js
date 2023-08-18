const { celebrate, Joi } = require('celebrate');

const validationLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().min(4).max(50).required()
      .email(),
    password: Joi.string().max(20).required(),
  }),
});

const validationRegisterUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().min(4).max(50).required()
      .email(),
    password: Joi.string().max(20).required(),
    name: Joi.string().min(2).max(30).required(),
  }),
});

const validationUpdateUserData = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required(),
  }),
});

module.exports = {
  validationLogin,
  validationRegisterUser,
  validationUpdateUserData,
};
