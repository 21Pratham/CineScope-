import React, { useState } from "react";

const AddReviewForm = ({ onSubmit, initialReview = {}, isEditing = false }) => {
  const [review, setReview] = useState(initialReview.review || "");
  const [rating, setRating] = useState(initialReview.rating || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ review, rating });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-dark text-light rounded shadow"
    >
      <div className="mb-3">
        <label className="form-label">Rating (0-10)</label>
        <input
          type="number"
          min="0"
          max="10"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="form-control bg-secondary text-light border-0"
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Review</label>
        <textarea
          rows="3"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="form-control bg-secondary text-light border-0"
          required
        />
      </div>
      <button type="submit" className="btn btn-warning">
        {isEditing ? "Update" : "Submit"}
      </button>
    </form>
  );
};

export default AddReviewForm;
