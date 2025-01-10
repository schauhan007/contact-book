import express from 'express';
import { getLoginPage, getRegisterPage, getForgotPasswordPage, getResetPasswordPage, postRegisteration, postLogin, logOutUser, forgotPassword, resetPassword } from '../contollers/auth.controller.js';

const authRouter = express.Router();

authRouter.get('/login', getLoginPage);
authRouter.get('/register', getRegisterPage);
authRouter.get('/forgetPassword', getForgotPasswordPage);
authRouter.get('/resetPassword/:token', getResetPasswordPage);

authRouter.post('/login', postLogin);
authRouter.post('/logout', logOutUser);
authRouter.post('/register' , postRegisteration);

authRouter.post('/password/forgotPassword', forgotPassword);
authRouter.post('/password/resetPassword/:token', resetPassword);

export default authRouter;