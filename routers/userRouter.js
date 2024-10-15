const Router = require('express');

const {getAllUsers } = require('../controller/userController');

const userRouter = Router()


userRouter.get('/get-all',getAllUsers);




module.exports = userRouter;