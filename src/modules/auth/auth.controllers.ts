import { Request, Response } from 'express';
import bcrypt from "bcrypt";
import {
    createNewUser,
    requestResetPassword,
    resetPassword,
    getUserEmail
} from './auth.services';

const signupController = async (req: Request, res: Response) => {
    const { 
        email,
        password,
        name
    } = req.body;

    if ( !name || !email || !password ) {
        return res.status(400).json({
            message: 'Missing required fields'
        });
    }

    const user = await getUserEmail(email);

    if ( !user ) {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await createNewUser({
            email,
            password: hashedPassword,
            name
        })
        if ( newUser ) {
           res
            .status(201)
            .json({ 
                message: 'User created successfully',   
                success: true,
                data: newUser
            }) 
        } else {
            res.status(400).json({
                message: 'Something went wrong'
            });
        }
    } else {
        res.status(400).json({
            message: 'User already exists'
        });
    }
};

const forgotPasswordController = async (req: Request, res: Response) => {   
    const { email } = req.body;

    if ( !email ) {
        return res.status(400).json({
            message: 'Missing required fields'
        });
    }

    const checkEmail = await requestResetPassword(email);

    if (checkEmail ) {
        res
            .status(201)
            .json({ 
                message: 'OTP has been sent to your email',   
                success: true,
            }) 
    } else {
        return res.status(400).json({
            message: 'Something went wrong'
        });
    }
};

const resetPasswordController = async (req: Request, res: Response) => {
    const { userId, token, password } = req.body;

    if ( !password ) {
        return res.status(400).json({
            message: 'Missing required fields'
        });
    }

    const reset = await resetPassword(
        userId,
        token,
        password
    );

    if ( reset ) {
        res
            .status(201)
            .json({ 
                message: 'Password reset was successful',   
                success: true,
            }) 
    } else {
        return res.status(400).json({
            message: 'Something went wrong'
        });
    }
}


export {
    signupController,
    forgotPasswordController,
    resetPasswordController
}
