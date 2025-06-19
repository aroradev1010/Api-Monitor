import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    endpointId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Endpoint",
      required: true,
    },
    message: String,
    statusCode: Number,
    latency: Number,
    type: { type: String, enum: ["latency", "error"], required: true },
  },
  { timestamps: true }
);

export const Alert =
  mongoose.models.Alert || mongoose.model("Alert", alertSchema);
