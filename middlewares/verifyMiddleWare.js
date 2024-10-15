const jwt = require('jsonwebtoken');
const asynHandler = require('express-async-handler');
const { log } = require('console');


const verifyToken = asynHandler(async (req, res, next) => {
    const accessToken = req.headers.authorization;
    const token = accessToken && accessToken.split(' ')[1];
    if (!token) {
        res.status(401).json({
            message: 'Not authorized, no token',
            success: false,
            statusCode: 401
        });
        throw new Error('Not authorized, no token');
    }
    try {
        const verify = jwt.verify(token, process.env.SECRET_KEY);
        if (verify) {
            next();
        }
    } catch (error) {
        res.status(403).json({
            message: 'Access token is not valid',
            success: false,
        });
        throw new Error('Access token is not valid');
    }


});




module.exports = verifyToken;
