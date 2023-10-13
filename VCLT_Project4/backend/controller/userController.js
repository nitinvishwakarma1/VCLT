import { usermodel } from '../model/usermodel.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import emailValidator from 'deep-email-validator';
import { URLSearchParams } from 'url';
import url from 'url';

const maxAge = 86400 * 1000;
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'vishnitin51@gmail.com',
        pass: 'rfbr ijwc vcey ibaf'
    }
});

export const SECRET_KEY = "crypto.randomBytes(32).toString('hex')";
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
            console.log(hashpassword);
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
                res.cookie('email', email, { httpOnly: true, maxAge: maxAge });
                if (!token) {
                    response.json({ message: "Error Occured while dealing with Token" });
                }
                // console.log("token", token);
                const formattedDate = dateAndTime();
                res.render("pages/main", { user: existinguser, field: "", date: formattedDate });
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

export const checkOTP = async (req, res) => {
    var requestURL = url.parse(req.url, true).query;
    var userotp = requestURL.otp1 + requestURL.otp2 + requestURL.otp3 + requestURL.otp4;
    console.log(userotp);
    if (otp == userotp) {
        console.log("otp match");
        const email = req.cookies.email;
        console.log(email);
        const user = await usermodel.findOne({ email: email });
        const formattedDate = dateAndTime();
        res.render('pages/main',{ user: user, field: "", date: formattedDate });
    }
    else {
        console.log("not match");
        res.render("pages/verifyOTP", { msg: "OTP Not Match" });
    }
}

export const viewProfileController = async (req, res, next) => {
    try {
        const email = req.cookies.email;
        const user = await usermodel.findOne({ email: email });

        if (!user) {
            console.log("User not found"); // Print to console
            return res.status(404).json({ message: "User not found" });
        }

        const formattedDate = dateAndTime();

        res.render("pages/userProfile", { user: user, field: "", date: formattedDate });

        // Send the user's profile details as a JSON response
        // return res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const editProfileController = async (req, res, next) => {
    try {

        const email = req.cookies.email;
        var field = req.params.field;
        console.log(field);
        console.log(email);
        
        const user = await usermodel.findOne({ email: email });
        console.log(user);
        console.log("hello1")

        if (!user) {
            console.log("User not found");
            return res.status(404).json({ message: "Request Timeout" });
        }
        const formattedDate = dateAndTime();
        console.log("hello2")
        res.render("pages/editProfile", { user: user, field: field, date: formattedDate });

    } catch (error) {
        console.error("Error fetching user profile:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const editProfileController2 = async (req, res, next) => {
    try {
        const email = req.cookies.email;
        var field = req.params.field;
        console.log(field);
        console.log(email);
        
        const user = await usermodel.findOne({ email: email });
        console.log(user);
        console.log("hello1")

        if (!user) {
            console.log("User not found"); // Print to console
            return res.status(404).json({ message: "User not found" });
        }
        else{
            const formattedDate = dateAndTime();
            console.log("hello2")
            switch (field) {
                case "userName": {
                    console.log("hello3");
                    const newUsername = req.body.username;
                    user.username = newUsername;
                    await user.save();
                    console.log("Data has been Updated Successfully");
                    break;
                }
                case "birthDate": {
                    const dob = req.body.birthdate;
                    if (!user.birthdate) {
                        user.birthdate = dob;
                        await user.save();
                    }
                    else{
                        user.birthdate = dob;
                        await user.save();
                    }
                    console.log("Data has been Updated Successfully");
                    break;
                }
                case "gender": {
                    user.gender = req.body.gender;
                    await user.save();
                    console.log("Data has been Updated Successfully");
                    break;
                }
                case "phone": {
                    user.contactNumber = req.body.contactNumber;
                    console.log(user.contactNumber);
                    await user.save();
                    console.log("Data has been Updated Successfully 😂");
                    break;
                }
                case "address": {
                    if (!user.address) {
                        user.address = req.body.address;;
                        await user.save();
                    }
                    else{
                        user.address = req.body.address;;
                        await user.save();
                    };
                    console.log("Data has been Updated Successfully 😂");
                    break;
                }
                case "changePassword": {
                    // const {cpassword, newpassword} = req.body;
                    // if (user.password == cpassword) {
                    //     user.password = newpassword;
                    //     await user.save();
                    // }
                    // else{
                    //     // alert("Current Password Not Match !");
                    //     // res.redirect('/viewprofile');
                    // };
                    break;
                }
            }
            res.redirect('/viewprofile');
        }

    } catch (error) {
        console.error("Error fetching user profile:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const manageProfileController= async (req, res, next) => {
    try {
        const email = req.cookies.email;
        console.log(email);
        const user = await usermodel.findOne({ email: email });
        if (!user) {
            console.log("User not found"); // Print to console
            return res.status(404).json({ message: "User not found" });
        }
        const formattedDate = dateAndTime();
        const field = req.params.field;
        console.log(user);
        if(req.params.field == "deactivate"){
            res.render("pages/manageProfile", { user: user, field: field, date: formattedDate });
        } 
        else {
            res.render("pages/editProfile", { user: user, field: field, date: formattedDate });
        }

    } catch (error) {
        console.error("Error fetching user profile:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
export const profilePictureController = async (req, res, next) => {
    try {
        const email = req.cookies.email;
        console.log(email);
        const user = await usermodel.findOne({ email: email });
        console.log(user);

        if (!user) {
            console.log("User not found"); // Print to console
            return res.status(404).json({ message: "User not found" });
        }
        const formattedDate = dateAndTime();
        const profilePicture = req.file.filename;
        console.log(profilePicture);
        if (!user.profile) {
            user.profile = profilePicture;
            await user.save();
        }
        else{
            user.profile = profilePicture;
            await user.save();
        }

        res.render("pages/userProfile", { user: user, field: "", date: formattedDate })
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const deactivateAccountController = async (req, res, next) => {
    try {
        const email = req.cookies.email;
        console.log(email);
        const user = await usermodel.findOne({ email: email });
        console.log(user);

        if (!user) {
            console.log("User not found"); // Print to console
            return res.status(404).json({ message: "User not found" });
        }
        const formattedDate = dateAndTime();
        await usermodel.deleteOne({ email: email });

        console.log(user);
        res.render("pages/", { user: user, field: "", date: formattedDate });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


function dateAndTime() {
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
    return formattedDate;
}
