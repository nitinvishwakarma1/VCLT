import { usermodel } from '../model/usermodel.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import emailValidator from 'deep-email-validator';

const maxAge = 3 * 24 * 60 * 60;
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'vishnitin51@gmail.com',
        pass: 'rfbr ijwc vcey ibaf'
    }
});

export const SECRET_KEY = crypto.randomBytes(32).toString('hex');
export var otp;
export default jwt;
let payload = {}
let token;

export const registerroute = async (req, res) => {
    const { username, birthyear, email, password } = req.body;
    try {
        const existinguser = await usermodel.findOne({ email: email });
        console.log("1", existinguser);
        if (existinguser) {
            res.render("pages/register", { msg: 'User Already Exist' });
        } else {
            const hashpassword = await bcrypt.hash(password, 10);
            const result = await usermodel.create({
                username: username,
                birthyear: birthyear,
                email: email,
                password: hashpassword
            });
            await result.save();
            console.log("2", result)

            payload.result = result;
            const expireTime = {
                expiresIn: '1d'
            }
            token = jwt.sign(payload, SECRET_KEY, expireTime);
            res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge });
            if (!token) {
                res.json({ message: "Error Occured while dealing with Token" });
            }
            console.log("3", token);

            otp = "";
            var data = req.body;
            for (let i = 1; i <= 4; i++) {
                otp += Math.floor(Math.random() * 10);
            }
            console.log("4", otp);

            const mailOptions = {
                from: 'vishnitin51@gmail.com',
                to: data.email,
                subject: 'OTP for signIn in VCLT',
                text: `This is the otp for the signup in VCLT Web app.your One Time Password is: ${otp}`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Error', error);
                } else {
                    console.log('Email sent successfull');
                }
            });
            res.render("pages/verifyOTP", { msg: "" });
            // res.redirect('pages/verifyOTP');
        }
    }
    catch (err) {
        console.log('something went wrong', err);
    }
}

export const verifyEmail = (req, res, next) => {
    const { email } = req.body;
    console.log(email);
    async function isEmailValid(email) {
        return emailValidator.validate(email);
    }
    (async () => {
        const { valid, reason, validators } = await isEmailValid(email);
        if (valid) {
            console.log('Email is valid');
            next();
        } else {
            console.log('Email is not valid. Reason:', validators[reason].reason);
            res.render("pages/register", { msg: 'Email is not Valid' });
        }
    })();
}

export const loginroute = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email);
        const existinguser = await usermodel.findOne({ email: email });

        payload.result = existinguser;
        const expireTime = {
            expiresIn: '1d'
        }
        if (!existinguser) {
            res.render('login', { msg: "user not found" });
        } else {
            const matchpassword = await bcrypt.compare(password, existinguser.password);
            if (!matchpassword) {
                console.log("passNotMatch");
                res.render("login", { msg: "Password Not Match" });
            } else {
                token = jwt.sign(payload, SECRET_KEY, expireTime);
                res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge });
                if (!token) {
                    response.json({ message: "Error Occured while dealing with Token" });
                }
                console.log("token", token);
                res.render("pages/main");
            }
        }
    }
    catch (err) {
        console.log('something went wrong', err);
    }
}

export const authenticateJWT = (request, response, next) => {
    console.log("authenticateJWT : ");
    const token = request.cookies.jwt;
    if (!token) {
        response.json({ message: "Error Occured while dealing with Token inside authenticateJWT" });
    }
    jwt.verify(token, SECRET_KEY, (err, payload) => {
        if (err)
            response.json({ message: "Error Occured while dealing with Token during verify" });
        request.payload = payload;
        next();
    });
}

export const authorizeUser = (request, response, next) => {
    console.log("5", request.payload.result.email);
    // response.render("pages/main", { msg: request.payload.result.email });
    next();
}