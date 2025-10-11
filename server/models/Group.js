const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  title: String,
  type: {
    type: String,
    enum: ["Documents", "Videos", "PracticeTest", "Notes"],
  },
  link: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

const chatSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: String,
  createdAt: { type: Date, default: Date.now },
});

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    resources: [resourceSchema],
    collaborativeNotes: { type: String, default: "" },
    chat: [chatSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Group", groupSchema);
