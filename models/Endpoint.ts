import mongoose from "mongoose";

const endpointSchema = new mongoose.Schema({
  name: String,
  url: String,
  tags: [String],
  createdAt: { type: Date, default: Date.now },
});

export const Endpoint =
  mongoose.models.Endpoint || mongoose.model("Endpoint", endpointSchema);
