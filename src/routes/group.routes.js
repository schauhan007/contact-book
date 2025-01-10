import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { addGroup, deleteGroup, editGroup, postGroupList } from '../controllers/group.controller.js';

const groupRouter = express.Router();

groupRouter.post('/list', authMiddleware, postGroupList);
groupRouter.post('/add', authMiddleware, addGroup);
groupRouter.post('/edit', authMiddleware, editGroup);
groupRouter.post('/delete', authMiddleware, deleteGroup);

export default groupRouter