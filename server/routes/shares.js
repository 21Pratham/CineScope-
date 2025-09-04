const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/auth");

// Share a review with other users (Functionality 13)
router.post("/", auth, (req, res) => {
  const { review_id, user_ids } = req.body;
  const sharerId = req.user.id;

  if (
    !review_id ||
    !user_ids ||
    !Array.isArray(user_ids) ||
    user_ids.length === 0
  ) {
    return res
      .status(400)
      .json({ message: "review_id and user_ids are required" });
  }

  const shares = user_ids.map((user_id) => [review_id, user_id, sharerId]);
  db.query(
    "INSERT INTO shares (review_id, user_id, sharer_id) VALUES ?",
    [shares],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Error sharing review" });
      res.status(201).json({ message: "Review shared successfully" });
    }
  );
});

// Fetch reviews shared with the authenticated user (Functionality 13)
router.get("/shared-with-me", auth, (req, res) => {
  const userId = req.user.id;
  db.query(
    "SELECT r.review_id, r.movie_id, r.user_id, r.review, r.rating, r.modified, u.email, m.title " +
      "FROM shares s " +
      "JOIN reviews r ON s.review_id = r.review_id " +
      "JOIN users u ON r.user_id = u.user_id " +
      "JOIN movies m ON r.movie_id = m.movie_id " +
      "WHERE s.user_id = ?",
    [userId],
    (err, results) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Error fetching shared reviews" });
      res.json(results);
    }
  );
});

module.exports = router;
