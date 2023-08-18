const badRequestMessage = {
  movie: 'Переданы некорректные данные при работе с фильмом',
  user: 'Переданы некорректные данные',
};
const notFoundMessage = {
  movie: 'Фильм по указанному _id не найден',
  user: 'Пользователь по указанному _id не найден',
  page: 'Cтраница не найдена',
};
const unauthorizedMessage = {
  user: 'Неправильная почта или пароль',
  auth: 'Ошибка авторизации',
};
const conflictMessage = {
  user: 'Пользователь с такой почтой уже зарегистрирован',
};
const forbiddenMessage = {
  movie: 'Недостаточно прав',
};
const serverErrorMessage = {
  server: 'На сервере произошла ошибка',
};
module.exports = {
  badRequestMessage,
  notFoundMessage,
  unauthorizedMessage,
  conflictMessage,
  forbiddenMessage,
  serverErrorMessage,
};
