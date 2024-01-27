const userRouter = require('express').Router();
const {
  updateUserData, getCurrentUser,
} = require('../controllers/users');
const { userDataValidation } = require('../middlewares/user-validation');

userRouter.get('/me', getCurrentUser);
userRouter.patch('/me', userDataValidation, updateUserData);

module.exports = { userRouter };
