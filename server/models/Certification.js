const mongoose = require("mongoose");
const { DOMAINS } = require("../constant/constant");

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const certificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    provider: { type: String, required: true },
    domain: { type: String, enum: DOMAINS, required: true },
    cost: { type: Number, required: true },
    deadline: { type: String, required: true },
    description: { type: String, required: true },
    credibility: {
      type: String,
      enum: ["verified", "trusted", "new"],
      default: "new",
    },
    facultyVerified: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    reviewList: [reviewSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Certification", certificationSchema);
