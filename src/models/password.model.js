import mongoose from "mongoose";

const passwordSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        email: {
            type: String,
        },
        resetPasswordToken: {
            type: String,
        },
        resetPasswordTokenExpire: {
            type: Date,
        },
    },
    { timestamps: true },
);

export const Password = mongoose.model("Password", passwordSchema);