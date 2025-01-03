import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { getDashboard, getGroups, getContacts, postContactList, addContact, editContact, deleteContact, postGroupList, addGroup, editGroup, deleteGroup } from "../contollers/user.controller.js";

const userRouter = express.Router();

userRouter.get('/dashboard', authMiddleware , getDashboard);
userRouter.get('/groups', authMiddleware , getGroups);
userRouter.get('/contacts', authMiddleware , getContacts);

userRouter.post('/contact/list', authMiddleware, postContactList);
userRouter.post('/contact/add', authMiddleware, addContact);
userRouter.post('/contact/edit', authMiddleware, editContact);
userRouter.post('/contact/delete', authMiddleware, deleteContact);

userRouter.post('/group/list', authMiddleware, postGroupList);
userRouter.post('/group/add', authMiddleware, addGroup);
userRouter.post('/group/edit', authMiddleware, editGroup);
userRouter.post('/group/delete', authMiddleware, deleteGroup);

export default userRouter;