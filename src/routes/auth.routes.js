import express from 'express';
import { getLoginPage, getRegisterPage, getForgotPasswordPage, getResetPasswordPage, postRegisteration, postLogin, logOutUser, forgotPassword, resetPassword, googleLogin } from '../controllers/auth.controller.js';
import passport from 'passport';
import { User } from '../models/user.model.js';
import jwt from 'jsonwebtoken';

const authRouter = express.Router();

authRouter.get('/', getLoginPage);
authRouter.get('/register', getRegisterPage);
authRouter.get('/forgetPassword', getForgotPasswordPage);
authRouter.get('/resetPassword/:token', getResetPasswordPage);

authRouter.post('/login', postLogin);
authRouter.post('/logout', logOutUser);
authRouter.post('/register' , postRegisteration);

authRouter.get('/auth/google', passport.authenticate('google', { scope: ["profile", "email"] }));
authRouter.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), googleLogin);

authRouter.post('/password/forgotPassword', forgotPassword);
authRouter.post('/password/resetPassword/:token', resetPassword);

export default authRouter;