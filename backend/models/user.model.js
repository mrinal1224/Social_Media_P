import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },

        password: {
            type: String,
            required: true
        },

        phone: {
            type: Number
        },

        bio: {
            type: String,
            trim: true,
            maxlength: 160
        },

        website: {
            type: String,
            trim: true
        },

        location: {
            type: String,
            trim: true,
            maxlength: 100
        },

        followers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],

        followings: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],

        posts: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }],

        stories: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Story"
        }],

        reels: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Reel"
        }],

        profileImage: {
            type: String
        }
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
