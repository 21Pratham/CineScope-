const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/auth");

// Fetch reviews for a specific movie (Functionality 7)
router.get("/movie/:movieId", auth, (req, res) => {
  const movieId = req.params.movieId;
  db.query(
    "SELECT r.review_id, r.movie_id, r.user_id, r.review, r.rating, r.modified, u.email, m.title " +
      "FROM reviews r " +
      "JOIN users u ON r.user_id = u.user_id " +
      "JOIN movies m ON r.movie_id = m.movie_id " +
      "WHERE r.movie_id = ?",
    [movieId],
    (err, results) => {
      if (err)
        return res.status(500).json({ message: "Error fetching reviews" });
      res.json(results);
    }
  );
});

// Fetch all reviews (Functionality 8)
router.get("/all", auth, (req, res) => {
  db.query(
    "SELECT r.review_id, r.movie_id, r.user_id, r.review, r.rating, r.modified, u.email, m.title " +
      "FROM reviews r " +
      "JOIN users u ON r.user_id = u.user_id " +
      "JOIN movies m ON r.movie_id = m.movie_id",
    (err, results) => {
      if (err)
        return res.status(500).json({ message: "Error fetching reviews" });
      res.json(results);
    }
  );
});

// Fetch authenticated user's reviews (Functionality 9)
router.get("/my-reviews", auth, (req, res) => {
  const userId = req.user.id;
  db.query(
    "SELECT r.review_id, r.movie_id, r.user_id, r.review, r.rating, r.modified, u.email, m.title " +
      "FROM reviews r " +
      "JOIN users u ON r.user_id = u.user_id " +
      "JOIN movies m ON r.movie_id = m.movie_id " +
      "WHERE r.user_id = ?",
    [userId],
    (err, results) => {
      if (err)
        return res.status(500).json({ message: "Error fetching reviews" });
      res.json(results);
    }
  );
});

// Add a new review (Functionality 10)
router.post("/", auth, (req, res) => {
  const { review, rating, movie_id } = req.body;
  const userId = req.user.id;

  if (!review || !rating || !movie_id)
    return res
      .status(400)
      .json({ message: "Review, rating, and movie_id are required" });
  if (rating < 0 || rating > 10)
    return res.status(400).json({ message: "Rating must be between 0 and 10" });

  db.query(
    "INSERT INTO reviews (movie_id, user_id, review, rating) VALUES (?, ?, ?, ?)",
    [movie_id, userId, review, rating],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Error adding review" });
      res.status(201).json({ message: "Review added successfully" });
    }
  );
});

// Update a review (Functionality 11)
router.put("/:id", auth, (req, res) => {
  const reviewId = req.params.id;
  const { review, rating } = req.body;
  const userId = req.user.id;

  if (!review || !rating)
    return res.status(400).json({ message: "Review and rating are required" });
  if (rating < 0 || rating > 10)
    return res.status(400).json({ message: "Rating must be between 0 and 10" });

  db.query(
    "UPDATE reviews SET review = ?, rating = ?, modified = 1 WHERE review_id = ? AND user_id = ?",
    [review, rating, reviewId, userId],
    (err, result) => {
      if (err)
        return res.status(500).json({ message: "Error updating review" });
      if (result.affectedRows === 0)
        return res
          .status(403)
          .json({ message: "Unauthorized or review not found" });
      res.json({ message: "Review updated successfully" });
    }
  );
});

// Delete a review (Functionality 12)
router.delete("/:id", auth, (req, res) => {
  const reviewId = req.params.id;
  const userId = req.user.id;

  db.query(
    "DELETE FROM reviews WHERE review_id = ? AND user_id = ?",
    [reviewId, userId],
    (err, result) => {
      if (err)
        return res.status(500).json({ message: "Error deleting review" });
      if (result.affectedRows === 0)
        return res
          .status(403)
          .json({ message: "Unauthorized or review not found" });
      res.json({ message: "Review deleted successfully" });
    }
  );
});

module.exports = router;
