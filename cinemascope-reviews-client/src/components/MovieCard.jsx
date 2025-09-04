import React from "react";

const MovieCard = ({ movie, onAddReview, onShowReviews }) => {
  return (
    <div className="card bg-dark text-light border-0 shadow">
      <div className="card-body">
        <h5 className="card-title text-warning">{movie.title}</h5>
        <p className="card-text">
          Release Date: {new Date(movie.release_date).toLocaleDateString()}
        </p>
        <button
          className="btn btn-warning me-2"
          onClick={() => onShowReviews()}
        >
          Show Reviews
        </button>
        <button
          className="btn btn-warning"
          onClick={() => onAddReview(movie.movie_id)}
        >
          Add Review
        </button>
      </div>
    </div>
  );
};

export default MovieCard;
