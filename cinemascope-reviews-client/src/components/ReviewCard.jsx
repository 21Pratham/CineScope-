import React from "react";

const ReviewCard = ({ review, userId, onEdit, onDelete, onShare }) => {
  const isOwner = review.user_id === userId;

  return (
    <div className="card mb-3 bg-dark text-light border-0 shadow">
      <div className="card-body">
        <h5 className="card-title text-warning">{review.title}</h5>
        <p className="card-text">
          <strong>Rating:</strong> {review.rating}/10
          <br />
          <strong>Review:</strong> {review.review}
          <br />
          <strong>By:</strong> {review.email}
          <br />
          {review.modified === 1 && <em>(Edited)</em>}
        </p>
        {isOwner && (
          <div>
            <button
              className="btn btn-warning me-2"
              onClick={() => onEdit(review)}
            >
              Edit
            </button>
            <button
              className="btn btn-warning me-2"
              onClick={() => onShare(review.review_id)}
            >
              Share
            </button>
            <button
              className="btn btn-danger"
              onClick={() => onDelete(review.review_id)}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
