const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { pipeline } = require("@xenova/transformers");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

const User = require("./models/User");
const Certification = require("./models/Certification");
const Group = require("./models/Group");

app.get("/", (req, res) => {
  res.send("CertiQuest API is running");
});

app.post("/api/users/signup", async (req, res) => {
  try {
    console.log(req.body);
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

app.get("/api/users/:token", async (req, res) => {
  try {
    const token = req.params.token;
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    console.error("Error fetching user by token:", error);
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

exports.createGroup = async (req, res) => {
  try {
    const { name, description, createdBy } = req.body;

    if (!name || !createdBy) {
      return res.status(400).json({ message: "Name and creator are required" });
    }

    const group = await Group.create({
      name,
      description,
      createdBy,
      members: [createdBy],
      resources: [],
      collaborativeNotes: "",
      chat: [],
    });

    res.status(201).json({ message: "Group created successfully", group });
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

app.post("/api/groups/add-user", async (req, res) => {
  try {
    const { groupId, userId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (!group.members.includes(userId)) group.members.push(userId);
    await group.save();

    res.json({ message: "User added to group", group });
  } catch (error) {
    console.error("Error adding user to group:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

app.post("/api/groups/add-resource", async (req, res) => {
  try {
    const { groupId, title, type, link, uploadedBy } = req.body;

    if (!title || !type || !groupId || !uploadedBy) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    group.resources.push({ title, type, link, uploadedBy });
    await group.save();

    res.json({
      message: "Resource added successfully",
      resources: group.resources,
    });
  } catch (error) {
    console.error("Error adding resource:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

app.put("/api/groups/update-notes", async (req, res) => {
  try {
    const { groupId, notes } = req.body;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    group.collaborativeNotes = notes;
    await group.save();

    res.json({
      message: "Notes updated successfully",
      notes: group.collaborativeNotes,
    });
  } catch (error) {
    console.error("Error updating notes:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

app.post("/api/groups/chat", async (req, res) => {
  try {
    const { groupId, userId, text } = req.body;

    if (!groupId || !userId || !text) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    group.chat.push({ user: userId, text, createdAt: new Date() });
    await group.save();

    res.json({ message: "Message added", chat: group.chat });
  } catch (error) {
    console.error("Error adding chat message:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

app.get("/api/groups/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const groups = await Group.find({ members: userId }).populate(
      "members",
      "fullName email"
    );
    res.json({ groups });
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({ message: "Server error", error });
  }
});
app.get("/api/faculty/pending-certs/:facultyId", async (req, res) => {
  try {
    const { facultyId } = req.params;
    console.log(facultyId);

    const faculty = await User.findById(facultyId);
    if (!faculty || faculty.role !== "Faculty") {
      return res
        .status(403)
        .json({ message: "Unauthorized: Not a faculty member" });
    }

    const pendingCerts = await Certification.find({
      facultyVerified: { $ne: true },
      domain: { $in: faculty.specialization },
    });

    res.json({ pendingCertifications: pendingCerts });
  } catch (error) {
    console.error("Error fetching pending certifications:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

let embedder;
let embedderReady = false;
let embedderInitError = null;

async function initEmbedder() {
  try {
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    embedderReady = true;
    console.log("Embedder initialized and ready.");
  } catch (error) {
    embedderInitError = error;
    console.error("Failed to initialize embedder:", error);
  }
}

initEmbedder();

function waitForEmbedder(req, res, next) {
  if (embedderReady) {
    return next();
  }
  if (embedderInitError) {
    return res.status(500).json({
      message: "Embedder failed to initialize",
      error: embedderInitError.toString(),
    });
  }
  res
    .status(503)
    .json({ message: "Embedder is initializing, please try again soon." });
}

async function getEmbedding(
  text,
  logOnceObj = { warned: false, loggedEmptyOutput: false }
) {
  if (!text || !text.trim()) {
    if (!logOnceObj.warned) {
      console.warn("getEmbedding called with empty text, using zero vector.");
      logOnceObj.warned = true;
    }
    return Array(384).fill(0);
  }

  const output = await embedder(text);
  let embeddingVector = [];

  if (output && typeof output === "object" && output.data && output.dims) {
    const [batch, tokens, dims] = output.dims;
    const tokenVectors = [];
    for (let t = 0; t < tokens; t++) {
      const start = t * dims;
      const end = start + dims;
      tokenVectors.push(output.data.slice(start, end));
    }

    embeddingVector = Array(dims).fill(0);
    tokenVectors.forEach((tok) => {
      tok.forEach((v, i) => (embeddingVector[i] += v));
    });
    embeddingVector = embeddingVector.map((v) => v / tokens);
  } else if (output && Array.isArray(output.data)) {
    embeddingVector = output.data.flat(Infinity);
  }

  if (!embeddingVector.length) {
    if (!logOnceObj.loggedEmptyOutput) {
      console.warn("Embedder output was empty. Raw output:", output);
      logOnceObj.loggedEmptyOutput = true;
    }
    embeddingVector = Array(384).fill(0);
  }

  return embeddingVector;
}

function cosineSim(a, b) {
  const dot = a.reduce((acc, v, i) => acc + v * b[i], 0);
  const normA = Math.sqrt(a.reduce((acc, v) => acc + v * v, 0));
  const normB = Math.sqrt(b.reduce((acc, v) => acc + v * v, 0));
  return dot / (normA * normB);
}

app.get(
  "/api/student/suggestion/:studentId",
  waitForEmbedder,
  async (req, res) => {
    const { studentId } = req.params;
    const student = await User.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const certifications = await Certification.find();

    const logOnceObj = { warned: false, loggedEmptyOutput: false };

    const interestsText = Array.isArray(student.interests)
      ? student.interests.join(". ")
      : "";
    const studentEmbedding = await getEmbedding(interestsText, logOnceObj);

    const scoredCerts = [];
    for (const cert of certifications) {
      const certText = [cert.title, cert.description, cert.domain]
        .filter(Boolean)
        .join(". ");
      const certEmbedding = await getEmbedding(certText, logOnceObj);
      const score = cosineSim(studentEmbedding, certEmbedding);
      scoredCerts.push({ cert, score });
    }

    scoredCerts.sort((a, b) => b.score - a.score);

    const suggestedCertifications = scoredCerts.slice(0, 10).map((s) => s.cert);

    res.json({ suggestedCertifications });
  }
);

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
