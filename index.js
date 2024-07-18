
const express = require('express')

const cors = require('cors')

const app = express()

app.use(cors())

const PORT = 3000;

app.get('/auth/hello',(req,res) =>{
    res.send('Hello World')
})

app.listen(PORT,(err) =>{
    if(err){
        console.log(err)
    }
    console.log(`Server is running at : http://localhost:${PORT}`)
})