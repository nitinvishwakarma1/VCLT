import mongoose from "./connection.js";

const user = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    profile: {
        type: String,
        required: false
    },
    birthyear: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    birthdate: {
        type: Number,
        required: false
    },
    contactNumber: {
        type: Number,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    }
});

export const usermodel = mongoose.model("user", user);