const Router = require('express');
const { register } = require('../controller/AuthController');

const authRouter = Router()

authRouter.post('/register',register);


    



module.exports = authRouter;