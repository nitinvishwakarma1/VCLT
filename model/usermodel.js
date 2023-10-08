import mongoose from "./connection.js";

const user = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    birthyear: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

export const usermodel = mongoose.model("user", user);