const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const getJWT = (email, id) => {
    const payload = {
        email,
        id
    };
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: '7d' // Token hết hạn sau 7 ngày
    });
    return token;
}

const register = asyncHandler(async (req, res) => {
    const { email, fullname, password } = req.body;

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
        res.status(400).json({ message: "User already exists" });
        throw new Error("User already exists")
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new UserModel({ email, fullname, password: hashedPassword });
    await newUser.save();
    res.status(200).json({
        message: "User created!",
        data: {
            id: newUser.id,
            email: newUser.email,
            fullname: newUser.fullname,
            accesstoken: await getJWT(email, newUser.id),
        }
        
    });

    console.log(newUser);
});


const login = asyncHandler ( async (req, res) => {
    const { email, password} = req.body;

    const existUser = await UserModel.findOne({email});

    if(!existUser){
        res.status(400).json({message: "User not found"});
        throw new Error("User not found");    
    }

    const isMatch = await bcrypt.compare(password, existUser.password);

    if(!isMatch){
        res.status(401).json({message: "Password is incorrect"});
        throw new Error("Password is incorrect");
    }

    
    res.status(200).json({
        message: "Login success",
        data: {
            id: existUser.id,
            email: existUser.email,
            fullname: existUser.fullname,
            accesstoken: await getJWT(email, existUser.id),
        }
    });
});

module.exports = {
    register,
    login,
    
}