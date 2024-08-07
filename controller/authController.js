const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");

require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
        user: process.env.USERNAME_EMAIL,
        pass: process.env.PASSWORD_EMAIL,
    },
});


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

const handleSendEmail = async (val, email) => {


    try {
        const info = await transporter.sendMail({
            from: `"Maddison Foo Koch 👻" <${process.env.USERNAME_EMAIL}>`,
            to: email,
            subject: "Verification email code",
            text: "your code to verification email",
            html: `<h1>${val}</h1>`,
        });

        console.log("Message sent: %s", info.messageId);
        return "send email successfully!";

    } catch (error) {
        console.log(`can not send email ${error}`);
        return error;
    }
};


const verification = asyncHandler(async (req, res) => {
    const { email } = req.body || {};
    console.log(email);

    if (!email) {
        res.status(400).json({ message: "Email is required" });
        return;
    }

    const verificationCode = Math.round(1000 + Math.random() * 9000);

    try {
        await handleSendEmail(verificationCode, email);
        res.status(200).json({ 
            message: "Send email successfully!" ,
            data:{
                code : verificationCode,
                email: email
            },
            status:200
        });
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: "Can not send email" });
    }



});



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


const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const existUser = await UserModel.findOne({ email });

    if (!existUser) {
        res.status(400).json({ message: "User not found" });
        throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(password, existUser.password);

    if (!isMatch) {
        res.status(401).json({ message: "Password is incorrect" });
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
    verification,

}