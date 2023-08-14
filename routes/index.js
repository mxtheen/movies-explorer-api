const router = require('express').Router();

const userRouter = require('./users');
const movieRouter = require('./movies');

const { registerUser, loginUser } = require('../controllers/users');

const { validationLogin, validationRegisterUser } = require('../middlewares/celebrate/user');
const { authMiddleware } = require('../middlewares/auth');

const NotFoundError = require('../utils/errors/NotFoundError');
const { notFoundMessage } = require('../utils/errMessages');

router.post('/signup', validationRegisterUser, registerUser);
router.post('/signin', validationLogin, loginUser);

router.use('/users', authMiddleware, userRouter);
router.use('/movies', authMiddleware, movieRouter);

router.use('*', (req, res, next) => {
  next(new NotFoundError(notFoundMessage.page));
});

module.exports = router;
