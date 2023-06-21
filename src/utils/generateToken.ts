import pkg from "jsonwebtoken";
import { Types } from "mongoose";

const { sign } = pkg;

const generateUToken = (id: Types.ObjectId) => {
	return sign({ id }, process.env.JWT_SECRET!, {
        expiresIn: '1d'
    })
}

export { generateUToken }