const Router = require('express');
const { register, login } = require('../controller/authController');

const authRouter = Router()

authRouter.post('/register',register);
authRouter.post('/login',login);




module.exports = authRouter;