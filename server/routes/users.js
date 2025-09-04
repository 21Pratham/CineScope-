const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const db = require("../config/db");

// Fetch all users (Functionality 3)
router.get("/", auth, (req, res) => {
  db.query("SELECT user_id, email FROM users", (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching users" });
    res.json(results);
  });
});

// Update user profile (Functionality 4)
router.put("/profile", auth, (req, res) => {
  const { email } = req.body;
  const userId = req.user.id;

  if (!email) return res.status(400).json({ message: "Email is required" });

  db.query(
    "UPDATE users SET email = ? WHERE user_id = ?",
    [email, userId],
    (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY")
          return res.status(400).json({ message: "Email already exists" });
        return res.status(500).json({ message: "Error updating profile" });
      }
      res.json({ message: "Profile updated successfully" });
    }
  );
});

// Update user password (Functionality 5)
router.put("/password", auth, (req, res) => {
  const { current_password, new_password } = req.body;
  const userId = req.user.id;

  if (!current_password || !new_password)
    return res
      .status(400)
      .json({ message: "Current and new passwords are required" });

  db.query(
    "SELECT password FROM users WHERE user_id = ?",
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Error fetching user" });

      const user = results[0];
      const isMatch = bcrypt.compareSync(current_password, user.password);
      if (!isMatch)
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });

      const hashedPassword = bcrypt.hashSync(new_password, 10);
      db.query(
        "UPDATE users SET password = ? WHERE user_id = ?",
        [hashedPassword, userId],
        (err) => {
          if (err)
            return res.status(500).json({ message: "Error updating password" });
          res.json({ message: "Password updated successfully" });
        }
      );
    }
  );
});

module.exports = router;
