import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false } 
);

const certificationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    provider: { type: String, required: true },
    domain: { type: String, required: true },
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

export default mongoose.model("Certification", certificationSchema);
