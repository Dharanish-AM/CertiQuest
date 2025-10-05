const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

const User = require("./models/User");
const Certification = require("./models/Certification");

app.get("/", (req, res) => {
  res.send("CertiQuest API is running");
});

app.post("/api/users/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "Student",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

app.post("/api/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

app.post("/api/certifications/add", async (req, res) => {
  try {
    const {
      title,
      provider,
      link,
      domain,
      cost,
      deadline,
      description,
      credibility,
      facultyVerified,
      rating,
      reviews,
      reviewList,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !provider ||
      !link ||
      !domain ||
      !cost ||
      !deadline ||
      !description
    ) {
      console.error("Missing required fields for certification add:", {
        title,
        provider,
        domain,
        cost,
        deadline,
        description,
      });
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if certification already exists
    const existingCertification = await Certification.findOne({
      title,
      provider,
    });
    if (existingCertification) {
      console.warn(
        `Certification already exists: title="${title}", provider="${provider}"`
      );
      return res.status(400).json({ message: "Certification already exists" });
    }

    // Create new certification
    const certification = await Certification.create({
      title,
      provider,
      link,
      domain,
      cost,
      deadline,
      description,
      credibility,
      facultyVerified,
      rating,
      reviews,
      reviewList,
    });

    console.log(
      `Certification added successfully: id=${certification._id}, title="${title}", provider="${provider}"`
    );
    res.status(201).json({
      message: "Certification added successfully",
      certification,
      success: true,
    });
  } catch (error) {
    console.error("Error adding certification:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

app.get("/api/certifications", async (req, res) => {
  try {
    const certifications = await Certification.find();
    res.json({ certifications });
  } catch (error) {
    console.error("Error fetching certifications:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

app.post("/api/certifications/review", async (req, res) => {
  try {
    const { certificationId, user, rating, text } = req.body;

    if (!certificationId || !user || !rating) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const certification = await Certification.findById(certificationId);
    if (!certification) {
      return res.status(404).json({ message: "Certification not found" });
    }

    certification.reviewList.push({
      user,
      rating,
      text,
      createdAt: new Date(),
    });
    certification.reviews = certification.reviewList.length;
    certification.rating =
      certification.reviewList.reduce((acc, review) => acc + review.rating, 0) /
      certification.reviews;

    await certification.save();

    res.json({
      message: "Review added successfully",
      certification,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

app.post("/api/certifications/verify", async (req, res) => {
  try {
    const { certificationId, facultyId } = req.body;

    if (!certificationId || !facultyId) {
      return res
        .status(400)
        .json({ message: "Missing certificationId or facultyId" });
    }
    const faculty = await User.findById(facultyId);
    if (!faculty || faculty.role !== "Faculty") {
      return res
        .status(403)
        .json({ message: "Unauthorized: Not a faculty member" });
    }
    const certification = await Certification.findById(certificationId);
    if (!certification) {
      return res.status(404).json({ message: "Certification not found" });
    }
    certification.facultyVerified = true;
    await certification.save();
    res.json({
      message: "Certification verified successfully",
      certification,
    });
  } catch (error) {
    console.error("Error verifying certification:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

app.delete("/api/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

app.put("/api/users/:id/bookmark", async (req, res) => {
  try {
    const userId = req.params.id;
    const { certificationId } = req.body;

    if (!certificationId) {
      return res.status(400).json({ message: "Missing certificationId" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.bookmarks.includes(certificationId)) {
      user.bookmarks.pull(certificationId);
    } else {
      user.bookmarks.push(certificationId);
    }

    await user.save();
    res.json({
      message: "Bookmark updated successfully",
      bookmarks: user.bookmarks,
    });
  } catch (error) {
    console.error("Error updating bookmark:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

mongoose
  .connect("mongodb://localhost:27017/certiquest")
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });
