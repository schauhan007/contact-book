import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    name: {
        type: String,
    },
    username: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    isGoogle: {
        type: Number,
        default: 0,
    }
})

export const User = mongoose.model('User', userSchema);