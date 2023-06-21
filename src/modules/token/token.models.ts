import mongoose, { Schema} from "mongoose";

const tokenSchema = new mongoose.Schema(
    {
	    userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        token: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            required: true,
            default: Date.now,
            expires: 900,
        },
    }
);

const Token = mongoose.model("Token", tokenSchema);

export default Token;
