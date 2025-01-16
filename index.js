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
import groupRouter from './src/routes/group.routes.js';
import contactRouter from './src/routes/contact.routes.js';
import passport from 'passport';
import { Strategy } from 'passport-google-oauth20';

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

app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback",
    }, (accessToken, refreshToken, profile, done) => {
        return done(null, profile);
    })
)

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.use('/', authRouter);
app.use('/user', userRouter);
app.use('/group', groupRouter);
app.use('/contact', contactRouter);

connectDB().then(() => {

    app.listen(process.env.APP_PORT, () => {
        console.log(`App is running on Port: ${process.env.APP_PORT}`);  
    });

})