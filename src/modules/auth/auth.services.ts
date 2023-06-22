import User from "./auth.models";
import Token from "../token/token.models";
import { sendEmail } from "../../utils/sendEmail";
import crypto from "crypto";    
import bcrypt from "bcrypt";
import { generateUToken } from "../../utils/generateToken";

import { TUserRegRequest } from "../../types/user";

const clientURL= process.env.CLIENT_URL;    

const getUserEmail = async (email: string) => {
    const query = User.where({ email: email });
	return await query.findOne();
}

const createNewUser = async ({
    name,
    email,
    password,
}: TUserRegRequest) => {
    const user = new User({
        name,
        email,
        password
    });

    const token = generateUToken(user._id);
    await user.save();

    let data = {
        userId: user._id,
        email: user.email,
        name: user.name,
        token: token
    }

    return data;
};

const requestResetPassword = async ( email: string ) => {
    const query = await User.findOne({ email: email });
    if (!query) {
        throw new Error("Account does not found");
    };

    const token = await Token.findOne({ userId: query._id });
    if (token) await token.deleteOne();

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, 12);

    const newToken = await Token.create({
        userId: query._id,
        token: hash,
        createdAt: Date.now()
    })

    if (newToken) {
        const link = `${clientURL}/reset-password?token=${resetToken}&id=${query._id}`;
        console.log(link);
        
        await sendEmail(
            query.email,
            "Password Reset",
            {
                name: query.name,
                link: link
            },
            './template/requestResetPassword.handlebars'
        );

        return { link };
    } else {
        throw new Error("Something went wrong");
    }
}

const resetPassword = async ( userId: string, token: string, password: string ) => {
    const query = await User.findById(userId);

    if ( query ) {

        const tokenQuery = await Token.findOne({ userId });
        if (!tokenQuery) {
            throw new Error("Token is invalid or expired");
        };
    
        const isMatch = await bcrypt.compare(token, tokenQuery.token);
        if (!isMatch) {
            throw new Error("Token is invalid or expired");
        };
    
        const hash = await bcrypt.hash(password, 12);
        
        const updatedAccount = await User.findByIdAndUpdate(
            { _id: userId }, 
            { password: hash },
            { new: true, useFindAndModify: false}
        );

        if ( updatedAccount ) {
            sendEmail(
                updatedAccount.email,
                'Password Reset Successfully',
                {
                    name: updatedAccount.name,
                },
                './template/resetPassword.handlebars'
            );

            await tokenQuery.deleteOne();
        };

        return ({ message: "Password reset successfully" })
    } else {
        throw new Error("Account does not exist");
    };
}

export {
    createNewUser,
    requestResetPassword,
    resetPassword,
    getUserEmail
}