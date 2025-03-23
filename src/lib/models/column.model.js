import { Schema, model } from "mongoose";

const columnSchema = new Schema(
  {
    title: { type: String, required: true },
    boardId: { type: Schema.Types.ObjectId, ref: "Board", required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default model("Column", columnSchema);
