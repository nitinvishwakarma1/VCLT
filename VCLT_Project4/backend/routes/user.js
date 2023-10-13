import express from 'express';
import { registerroute, otp, loginroute, verifyEmail, authenticateJWT, authorizeUser,checkOTP, SECRET_KEY, viewProfileController, editProfileController, editProfileController2, manageProfileController,profilePictureController,deactivateAccountController} from '../controller/userController.js';
import jwt from '../controller/userController.js';
import url from 'url';
import upload from '../model/upload.js';


const router = express.Router();

router.get('/', (req, res) => {
    console.log("login");
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, SECRET_KEY, (err, decodedToken) => {
            if (err) {
                console.log("if inside ", err);
                res.render("pages/index", { msg: '' });
            } else {
                console.log("else inside ");
                const currentDate = new Date();
                const formattedDate = new Intl.DateTimeFormat('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                }).format(currentDate);
                res.render("pages/main", { user: "", field: "", date: formattedDate });
            }
        });
    } else {
        console.log("else outside ");
        res.render("pages/index", { msg: '' });
    }
});

router.get('/register', (req, res) => {
    res.render('pages/register', { msg: '' });
});

router.post('/userDetails', verifyEmail, registerroute);

router.post('/checkUser', loginroute);

router.get('/login', (req, res) => {
    res.render("pages/login", { msg: '' });
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

router.get('/main', authenticateJWT, authorizeUser,checkOTP);

router.get('/logout', (req, res) => {
    console.log("logout");
    res.cookie('jwt', "", { httpOnly: true, maxAge: 1 });
    res.render('pages/index', { msg: '' });
});

router.get('/viewprofile', viewProfileController);


router.get('/updateprofile/:field', editProfileController);

router.post('/updateprofile/:field', editProfileController2);

router.get('/manageprofile/:field',manageProfileController);
router.post('/photo',upload,profilePictureController)
router.get('/deactivate',deactivateAccountController);


export default router;