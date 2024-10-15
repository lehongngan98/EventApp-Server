
const express = require('express')

const cors = require('cors');
const authRouter = require('./routers/authRouter');
const userRouter = require('./routers/userRouter');
const connectDB = require('./configs/connectDB');
const errorMiddleHandle = require('./middlewares/errorMiddleWare');
const dotenv = require('dotenv');
const verifyToken = require('./middlewares/verifyMiddleWare');
const app = express()

dotenv.config();

app.use(cors())
app.use(express.json())
connectDB();

const PORT = 3000;

app.use('/auth', authRouter);
app.use('/users',verifyToken, userRouter);

app.use(errorMiddleHandle);


app.listen(PORT,(err) =>{
    if(err){
        console.log(err)
    }
    console.log(`Server is running at : http://localhost:${PORT}`)
})