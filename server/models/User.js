const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    role: {
      type: String,
      enum: ["Student", "Faculty", "Admin"],
      required: true,
    },

    // Student specific
    university: { type: String },
    degree: { type: String },
    graduationYear: { type: Number },
    interests: [{ type: String }],

    // Faculty specific
    department: { type: String },
    specialization: { type: String },
    yearsOfExperience: { type: Number },

    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Certification" }],
    password: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
