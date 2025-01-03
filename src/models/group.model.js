import mongoose from "mongoose";

const groupSchema = mongoose.Schema(
    {
        groupName: {
            type: String,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    },
    {
        timestamps : true
    }
)

export const Group = mongoose.model('Group', groupSchema);