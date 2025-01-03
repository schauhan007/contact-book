import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { connectDB } from './src/utils/db-helper.js';
import path from 'path';
import session from 'express-session';
import cookieParser from "cookie-parser";
import authRouter from './src/routes/auth.routes.js';
import userRouter from './src/routes/user.routes.js';
import fileUpload from 'express-fileupload';

const app = express();
const __dirname = path.resolve();

app.use('/assets', express.static(__dirname + '/assets'));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false,
        }
    })
)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views' , __dirname + "/src/views/");

app.use(fileUpload());

app.use('/', authRouter);
app.use('/user', userRouter);

connectDB().then(() => {

    app.listen(process.env.APP_PORT, () => {
        console.log(`App is running on Port: ${process.env.APP_PORT}`);  
    });

})