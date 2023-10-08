import express from 'express';
import { registerroute, otp, loginroute, verifyEmail, authenticateJWT, authorizeUser, SECRET_KEY } from '../controller/userController.js';
import jwt from '../controller/userController.js';
import url from 'url';

const router = express.Router();

router.get('/', (req, res) => {
    res.render('pages/index');
});

router.get('/register', (req, res) => {
    res.render('pages/register', { msg: '' });
});

router.post('/userDetails', verifyEmail, registerroute);

router.post('/checkUser', loginroute);

router.get('/login', (req, res) => {
    console.log("login");
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, SECRET_KEY, (err, decodedToken) => {
            if (err) {
                console.log("if inside ", err);
                res.render("pages/login", { msg: '' });
            } else {
                console.log("else inside ");
                res.render("pages/main");
            }
        });
    } else {
        console.log("else outside ");
        res.render("pages/login", { msg: '' });
    }
});

router.get('/forgetPassword', (req, res) => {
    res.render('pages/forgetPassword');
});

router.get('/passwordOTP', (req, res) => {
    res.render('pages/passwordOTP');
});

router.get('/changePassword', (req, res) => {
    res.render('pages/changePassword');
});

router.get('/main', authenticateJWT, authorizeUser, (req, res) => {
    var requestURL = url.parse(req.url, true).query;
    var userotp = requestURL.otp1 + requestURL.otp2 + requestURL.otp3 + requestURL.otp4;
    console.log(userotp);
    if (otp == userotp) {
        console.log("otp match");
        res.render('pages/main');
    }
    else {
        console.log("not match");
        res.render("pages/verifyOTP", { msg: "OTP Not Match" });
    }
});

router.get('/logout', (req, res) => {
    console.log("logout");
    res.cookie('jwt', "", { httpOnly: true, maxAge: 1 });
    res.render('pages/index', { msg: '' });
});

export default router;