import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
        name: {
          type: String,
          trim: true,
          required: true,
          unique: true,
        },
        email: {
          type: String,
          trim: true,
          unique: true,
          required: true,
        },
        password: { type: String },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

export default User;
