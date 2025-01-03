import { text } from 'express';
import nodemailer from 'nodemailer';

export const sendEmail = async (options) => { 

    const transporter = nodemailer.createTransport({

        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    
    });

    const emailOptions = {
        
        from: "Contact-Book Support <support@contact-book.com>",
        to: options.email,
        subject: options.subject,
        html: options.message,

    };

    await transporter.sendMail(emailOptions);

};