const router = require('express').Router();
const { userRouter } = require('./users');
const { movieRouter } = require('./movies');
const { createUser, login, signout } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { loginValidation, registerValidation } = require('../middlewares/user-validation');

router.post('/signin', loginValidation, login);
router.post('/signup', registerValidation, createUser);
router.use(auth);
router.use('/users', userRouter);
router.use('/movies', movieRouter);
router.post('/signout', signout);

module.exports = { router };
