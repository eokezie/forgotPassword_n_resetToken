import express from 'express';
import nodemailer from 'nodemailer';    
import handlebars from 'handlebars';
import fs from 'fs';    
import path from 'path';

const sendEmail = async (
    email: string, 
    subject: string, 
    payload: any, 
    template: string
) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: 465,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const source = fs.readFileSync(path.join(__dirname, template), 'utf8'); 
        const compiledTemplate = handlebars.compile(source);
        const options = () => { 
            return {
                from: process.env.EMAIL_FROM,
                to: email,
                subject: subject,
                html: compiledTemplate(payload)
            }
        }

        transporter.sendMail(options(), (error, info) => {
            if (error) {
                return error;
            } else {
                return console.log('Email Sent!!!')
            }
        });

    } catch (error) {
        return error;
    }
};

export { sendEmail }