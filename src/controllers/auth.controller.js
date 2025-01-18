import { User } from "../models/user.model.js";
import { success_res, error_res } from "../config/general.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendEmail } from "../utils/email.js";
import { Password } from "../models/password.model.js";

// get login page controller
export const getLoginPage = async (req, res) => {

    try {

        if(req.session.user){
            
            return res.redirect('/user/dashboard');
        }
        res.render('login');

    } catch (error) {
        return res.json(error_res(error));
    }

}


// get register page controller
export const getRegisterPage = async (req, res) => {
    try {
        res.render('register')
    } catch (error) {
        return res.json(error_res(error));
    }
}


// get forgot password page controller
export const getForgotPasswordPage = async (req, res) => {
    try {
        return res.render('forgetPassword');
    } catch (error) {
        return res.json(error_res(error));
    }
}


export const getAuthErrorPage = async (req, res) => {
    try {
        return res.render('authError');
    } catch (error) {
        return res.json(error_res(error));
    }
}


// get forgot password page controller
export const getResetPasswordPage = async (req, res) => {
    try {
        let token = req.params.token;
        console.log("Token-------------->", token);
        
        const tokenExist = await Password.findOne({resetPasswordToken: token});

        if(!tokenExist){
            return res.render('404');
        }

        return res.render('resetPassword');
    } catch (error) {
        return res.json(error_res(error));
    }
}


// registeration controller
export const postRegisteration = async (req, res) => {
    try {
        
        const { name, username, email, password } = req.body;

        console.log("Req.body----------->", req.body);
        
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const passwordPattern = /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\d\s])(?!.*\s).{8,}$/;
        const namePattern = /^[A-Za-z]+$/;
        const usernamePattern = /^(?=(.*[a-z]){3})[a-zA-Z0-9_]{3,15}$/;

        if(!name){
            return res.json(error_res("name is required!"))
        }
        if(!(namePattern.test(name))){
            return res.json(error_res("Please enter valid name"));
        }
        if(name.length < 3 ){
            return res.json(error_res("Name must be at least 3 characters"));
        }
        if(!username){
            return res.json(error_res("username is required!"))
        }
        if(!(usernamePattern.test(username))){
            return res.json(error_res("Username must contain at least 3 alphabetic characters"))
        }
        if(username.length < 3){
            return res.json(error_res("Username must be at least 3 characters"));
        }
        if(!email){
            return res.json(error_res("email is required!"))
        }
        if(!(emailPattern.test(email))){
            return res.json(error_res("Please enter valid email"));
        }
        if(!password){
            return res.json(error_res("password is required!"))
        }
        if (!(passwordPattern.test(password))) {
            return res.json(error_res("Password must be 8 characters with uppercase, lowercase, number and special character"));
        }

        // user validation for registeration
        const checkUsername = await User.findOne({username: username});
        
        if(!checkUsername){
            const checkEmail = await User.findOne({email: email});
            if(!checkEmail){

                const hashedPassword = await bcrypt.hash(password, 10)
                
                const data = await User.create({
                    name: name,
                    username: username,
                    email: email,
                    password: hashedPassword,
                })
        
                return res.json(success_res("Registration Successfull", { data }))
            }
            else{
                return res.json(error_res("The email address provided is already in use"));
            }
        }else{
            return res.json(error_res("The username provided is already in use"));
        }

    } catch (error) {
        return res.json(error_res(error));
    }
}


// login controller
export const postLogin = async (req, res) => {
    try {

        const { email, password } = req.body;
        
        if(!email) return res.json(error_res("Email is required"));
        if(!password) return res.json(error_res("Password is required"));
        
        const user = await User.findOne({ email });
        
        if(!user) return res.json(error_res("Invalid email or password"));
        if(user.isGoogle === 1) return res.json(error_res("Please use google sign-in"));

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json(error_res("Invalid email or password"));
        }

        const token = jwt.sign({id: user._id,name: user.name, email: user.email,}, process.env.JWT_SECRET, {
            expiresIn : "1d",
        })
                
        req.session.user = user;       
        req.session.token = token;

        return res.json(success_res("Verified user email & password"));
        
    } catch (error) {
        return res.json(error_res(error));
    }
}


export const googleLogin = async (req, res) => {
    
    const user = req.user;
    const email = user.emails[0].value;
    const name = user.displayName;
    
    const userExist = await User.findOne({email: email});

    if(!userExist){
        const randomNumber = Math.floor(Math.random() * 1000).toString().padStart(4, '0');
        const username = user.name.givenName.slice(0, 4).toLowerCase() + user.name.familyName.slice(0, 4).toLowerCase() + randomNumber;

        await User.create({
            name: name,
            username: username,
            email: email,
            password: null,
            isGoogle: 1,
        });
    }

    const findUser = await User.findOne({email: email});

    const token = jwt.sign({id: findUser._id,name: findUser.name, email: findUser.email,}, process.env.JWT_SECRET, {
                expiresIn : "1d",
            })
                    
            req.session.user = findUser;   
            req.session.token = token;
    
    res.redirect('/user/dashboard');
} 


// logout controller
export const logOutUser = async (req, res) => {
    try{

        req.session.destroy();
        return res.json(success_res("Logout successfully!"));
    }
    catch(error){
        return res.json(error_res(error));
    }
}


// ------------------------------------ Password Controllers ------------------------------------

// forget password controller 
export const forgotPassword = async (req, res) => {
    try {

        const email = req.body.email;

        if(!email){
            return res.json(error_res("Please enter your email"));
        }

        const findUser = await User.findOne({ email: email });

        if(!findUser){
            return res.json(error_res("Invalid Email"));
        }

        if(findUser.isGoogle === 1){
            return res.json(error_res("This account sign up via google sign-in", {isGoogle: 1}));
        }

        const findPreviousToken = await Password.findOne({ email: email, resetPasswordTokenExpire: { $gt: Date.now() } });

        if(findPreviousToken){
            return res.json(success_res("You have already requested for password reset. Please check your email"));
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        const encryptedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const resetPasswordTokenExpire = Date.now() + 10 * 60 * 1000;

        
        const resetUrl = `${req.protocol}://${req.get('host')}/resetPassword/${encryptedResetToken}`;
        
        const options = {
            email: findUser.email,
            subject: "Reset Password",
            message: `A password reset event has been triggered for your account. Please click on the link below to reset your password. \n\n <a href="${resetUrl}">${resetUrl}</a> \n\n This link will expire in 10 minutes.`,
        }
        
        // send email
        const verifyEmailSendOrNot = await sendEmail(options);
        
        if(verifyEmailSendOrNot === "success"){
            
            await Password.create({
                userId: findUser._id,
                email: findUser.email,
                resetPasswordToken: encryptedResetToken,
                resetPasswordTokenExpire: resetPasswordTokenExpire,
            });
            
            return res.json(success_res("A password reset link has been sent successfully. Please check your email inbox.", {email, encryptedResetToken, resetUrl}));
        }


    } catch (error) {
        return res.json(error_res(error));
    }
}


// reset password controller
export const resetPassword = async (req, res) => {

    try {
        
        const resetToken = req.params.token;

        const findToken = await Password.findOne({ resetPasswordToken: resetToken, resetPasswordTokenExpire: { $gt: Date.now() }});

        if(!findToken){
            return res.json(error_res("The token has expired"));
        }

        const {resetPassword, verifyResetPassword} = req.body;
        const passwordPattern = /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\d\s])(?!.*\s).{6,}$/;

        if(!resetPassword){
            return res.json(error_res("A password is required"));
        }
        if(!verifyResetPassword){
            return res.json(error_res("Password verification is required"));
        }
        if(!(passwordPattern.test(resetPassword))) {
            return res.json(error_res("Password must be 8 characters with uppercase, lowercase, number and special character"));
        }
        if(resetPassword !== verifyResetPassword){
            return res.json(error_res("Both password field should be same"));
        }
        
        const newPassword = req.body.resetPassword;
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await User.findByIdAndUpdate(findToken.userId, { password: hashedPassword });

        await Password.findOneAndDelete({ resetPasswordToken: resetToken });

        req.session.destroy();

        return res.json(success_res("Password Reset Successfully"));

    } catch (error) {
        return res.json(error_res(error));
    }
}