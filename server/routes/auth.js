const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Register a new user (Functionality 1)
router.post("/register", (req, res) => {
  console.log("Register Request Body:", req.body);
  const { email, password } = req.body;

  // Trim and validate email and password
  const trimmedEmail = email?.trim();
  const trimmedPassword = password?.trim();
  if (!trimmedEmail || !trimmedPassword) {
    console.log("Invalid email or password (empty after trim):", {
      email,
      password,
    });
    return res
      .status(400)
      .json({ message: "Email and password are required and cannot be empty" });
  }

  // Validate email format
  if (!emailRegex.test(trimmedEmail)) {
    console.log("Invalid email format:", trimmedEmail);
    return res.status(400).json({ message: "Invalid email format" });
  }

  // Validate password length
  if (trimmedPassword.length < 6) {
    console.log("Password too short:", trimmedPassword);
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
  }

  const hashedPassword = bcrypt.hashSync(trimmedPassword, 10);

  db.query(
    "INSERT INTO users (email, password) VALUES (?, ?)",
    [trimmedEmail, hashedPassword],
    (err, result) => {
      if (err) {
        console.error("Database Error (Register):", err);
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ message: "Email already exists" });
        }
        return res
          .status(500)
          .json({ message: "Error registering user", error: err.message });
      }
      res.status(201).json({ message: "User registered successfully" });
    }
  );
});

// Login a user (Functionality 2)
router.post("/login", (req, res) => {
  console.log("Login Request Body:", req.body);
  const { email, password } = req.body;

  // Trim and validate email and password
  const trimmedEmail = email?.trim();
  const trimmedPassword = password?.trim();
  if (!trimmedEmail || !trimmedPassword) {
    console.log("Invalid email or password (empty after trim):", {
      email,
      password,
    });
    return res
      .status(400)
      .json({ message: "Email and password are required and cannot be empty" });
  }

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [trimmedEmail],
    (err, results) => {
      if (err) {
        console.error("Database Error (Login):", err);
        return res
          .status(500)
          .json({ message: "Error logging in", error: err.message });
      }
      if (results.length === 0) {
        console.log("User not found:", trimmedEmail);
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const user = results[0];
      const isMatch = bcrypt.compareSync(trimmedPassword, user.password);
      if (!isMatch) {
        console.log("Password mismatch for user:", trimmedEmail);
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign(
        { id: user.user_id, email: user.email },
        "mySecretKey123",
        { expiresIn: "1h" }
      );
      res.json({ token, user: { id: user.user_id, email: user.email } });
    }
  );
});

module.exports = router;
