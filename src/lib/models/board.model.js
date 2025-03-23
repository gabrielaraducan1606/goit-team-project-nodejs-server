import { Schema, model } from "mongoose";

const boardSchema = new Schema(
  {
    title: { type: String, required: true },
    background: { type: String, default: "default" },
    icon: { type: String, default: "" },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default model("Board", boardSchema);
