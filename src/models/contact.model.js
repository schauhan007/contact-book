import mongoose from "mongoose";

const contactSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        name: {
            type: String,
        },
        email: {
            type: String,
        },
        image: {
            type: String,
        },
        MobileNumber: {
            type: Number,
        },
        groupId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group',
        },
    },
    {
        timestamps : true
    }
);

export const Contact = mongoose.model('Contact', contactSchema);