// models/Log.ts
import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    endpointId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Endpoint",
      required: true,
    },
    statusCode: { type: Number, required: true },
    latency: { type: Number, required: true },
  },
  {
    timestamps: true, // <-- adds createdAt & updatedAt
  }
);

export const Log = mongoose.models.Log || mongoose.model("Log", logSchema);
