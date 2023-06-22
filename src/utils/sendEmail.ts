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

        console.log("Email sender")
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_HOST,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        console.log("Email sender2")

        const templatePath = path.join(__dirname, template);
        const source = fs.readFileSync(templatePath, 'utf8');
        const compiledTemplate = handlebars.compile(source);

        console.log('Issue!!!')
        const options = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: subject,
            html: compiledTemplate(payload)
        }

        console.log("Email sender3")

        transporter.sendMail(options, (error, info) => {
            if (error) {
                return error;
            } else {
                return console.log('Email Sent!!!')
            }
        });

        console.log("Email sender4")

    } catch (error) {
        return error;
    }
};

export { sendEmail }