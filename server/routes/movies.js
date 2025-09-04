const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/auth");

// Fetch all movies (Functionality 6)
router.get("/", auth, (req, res) => {
  db.query(
    "SELECT movie_id, title, release_date FROM movies",
    (err, results) => {
      if (err)
        return res.status(500).json({ message: "Error fetching movies" });
      res.json(results);
    }
  );
});

module.exports = router;
