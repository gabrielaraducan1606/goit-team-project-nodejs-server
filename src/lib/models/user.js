import mongoose from "mongoose";

const { Schema, model } = mongoose;

const emailRegExp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const schema = new Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: emailRegExp,
      unique: true,
    },
    password: {
      type: String,
      minlength: 8,
      required: [true, "Password is required"],
    },
    token: { type: String, default: null },
    avatarURL: { type: String },
    accessToken: { type: String },
    refreshToken: { type: String },
  },
  { versionKey: false, timestamps: true }
);

const User = model("User", schema);

export default User;
