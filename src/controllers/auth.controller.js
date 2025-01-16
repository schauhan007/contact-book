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


// get forgot password page controller
export const getResetPasswordPage = async (req, res) => {
    try {
        return res.render('resetPassword');
    } catch (error) {
        return res.json(error_res(error));
    }
}


// registeration controller
export const postRegisteration = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        const passwordPattern = /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\d\s])(?!.*\s).{6,}$/;

        if(!name){
            return res.json(error_res("name is required!"))
        }
        if(!username){
            return res.json(error_res("username is required!"))
        }
        if(!email){
            return res.json(error_res("email is required!"))
        }
        if(!password){
            return res.json(error_res("password is required!"))
        }
        if (!(passwordPattern.test(password))) {
            return res.json(error_res("Password length must br 8 with 1 digit, capital letter, small letter and a special character"));
        }

        // user validation for registeration
        const checkUsername = await User.find({username: username});
        
        if(!checkUsername.length){
            const checkEmail = await User.find({email: email});
            if(!checkEmail.length){

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
                return res.json(error_res("Email is already exist"));
            }
        }else{
            return res.json(error_res("Username is already taken"));
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
            return res.json(error_res("The token is invalid or has expired"));
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
            return res.json(error_res("Password length must br 8 with 1 digit, capital letter, small letter and a special character"));
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