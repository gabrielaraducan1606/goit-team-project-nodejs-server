import { Schema, model } from "mongoose";

const cardSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    columnId: { type: Schema.Types.ObjectId, ref: "Column", required: true },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    deadline: Date,
  },
  { timestamps: true }
);

export default model("Card", cardSchema);
