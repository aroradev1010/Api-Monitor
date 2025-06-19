import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  endpointId: { type: mongoose.Schema.Types.ObjectId, ref: "Endpoint" },
  statusCode: Number,
  latency: Number,
  timestamp: { type: Date, default: Date.now },
});

export const Log = mongoose.models.Log || mongoose.model("Log", logSchema);
