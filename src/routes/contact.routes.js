import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { addContact, deleteContact, editContact, postContactList } from '../controllers/contact.controller.js';

const contactRouter = express.Router();

contactRouter.post('/list', authMiddleware, postContactList);
contactRouter.post('/add', authMiddleware, addContact);
contactRouter.post('/edit', authMiddleware, editContact);
contactRouter.post('/delete', authMiddleware, deleteContact);

export default contactRouter