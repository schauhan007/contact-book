import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { getDashboard, getGroups, getContacts } from "../contollers/user.controller.js";

const userRouter = express.Router();

userRouter.get('/dashboard', authMiddleware , getDashboard);
userRouter.get('/groups', authMiddleware , getGroups);
userRouter.get('/contacts', authMiddleware , getContacts);

export default userRouter;