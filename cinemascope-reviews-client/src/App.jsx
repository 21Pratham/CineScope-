import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import LoginForm from "./components/LoginForm.jsx";
import ProfileForm from "./components/ProfileForm.jsx";
import MovieCard from "./components/MovieCard.jsx";
import ReviewCard from "./components/ReviewCard.jsx";
import AddReviewForm from "./components/AddReviewForm.jsx";
import ShareReviewModal from "./components/ShareReviewModal.jsx";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [movies, setMovies] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [sharedReviews, setSharedReviews] = useState([]);
  const [movieReviews, setMovieReviews] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [showAddReview, setShowAddReview] = useState(false);
  const [showEditReview, setShowEditReview] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [viewMode, setViewMode] = useState("movies");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      const userData = JSON.parse(localStorage.getItem("user"));
      setUser(userData);
      fetchMovies(token);
      fetchAllReviews(token);
      fetchMyReviews(token);
      fetchSharedReviews(token);
    }
  }, []);

  const fetchMovies = async (token) => {
    try {
      const res = await axios.get("http://localhost:3000/api/movies", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMovies(res.data);
    } catch (err) {
      console.error("Error fetching movies:", err);
    }
  };

  const fetchAllReviews = async (token) => {
    try {
      const res = await axios.get("http://localhost:3000/api/reviews/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllReviews(res.data);
    } catch (err) {
      console.error("Error fetching all reviews:", err);
    }
  };

  const fetchMyReviews = async (token) => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/reviews/my-reviews",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMyReviews(res.data);
    } catch (err) {
      console.error("Error fetching my reviews:", err);
    }
  };

  const fetchSharedReviews = async (token) => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/shares/shared-with-me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSharedReviews(res.data);
    } catch (err) {
      console.error("Error fetching shared reviews:", err);
    }
  };

  const fetchMovieReviews = async (movieId, token) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/reviews/movie/${movieId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMovieReviews(res.data);
      setViewMode("movieReviews");
    } catch (err) {
      alert("Error fetching reviews for this movie");
    }
  };

  const handleRegister = async (email, password) => {
    if (!email.trim() || !password.trim()) {
      alert("Please enter both email and password");
      return;
    }
    console.log("Register Payload:", { email, password });
    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/register",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      alert("Registration successful! Please login to continue.");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Error during registration";
      console.error("Registration Error:", errorMessage);
      alert(errorMessage);
    }
  };

  const handleLogin = async (email, password) => {
    if (!email.trim() || !password.trim()) {
      alert("Please enter both email and password");
      return;
    }
    console.log("Login Payload:", { email, password });
    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setIsLoggedIn(true);
      setUser(res.data.user);
      fetchMovies(res.data.token);
      fetchAllReviews(res.data.token);
      fetchMyReviews(res.data.token);
      fetchSharedReviews(res.data.token);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error during login";
      console.error("Login Error:", errorMessage);
      alert(errorMessage);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    setMovies([]);
    setAllReviews([]);
    setMyReviews([]);
    setSharedReviews([]);
    setMovieReviews([]);
    setViewMode("movies");
  };

  const handleAddReview = (movieId) => {
    setSelectedMovieId(movieId);
    setShowAddReview(true);
  };

  const handleSubmitReview = async (reviewData) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3000/api/reviews",
        {
          ...reviewData,
          movie_id: selectedMovieId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setShowAddReview(false);
      fetchMyReviews(token);
      alert("Review added successfully");
    } catch (err) {
      alert("Error adding review");
    }
  };

  const handleEditReview = (review) => {
    setSelectedReview(review);
    setShowEditReview(true);
  };

  const handleUpdateReview = async (reviewData) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/api/reviews/${selectedReview.review_id}`,
        reviewData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setShowEditReview(false);
      fetchMyReviews(token);
      alert("Review updated successfully");
    } catch (err) {
      alert("Error updating review");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:3000/api/reviews/${reviewId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchMyReviews(token);
        alert("Review deleted successfully");
      } catch (err) {
        alert("Error deleting review");
      }
    }
  };

  const handleShareReview = (reviewId) => {
    setSelectedReviewId(reviewId);
    setShowShareModal(true);
  };

  const handleUpdateProfile = async (formData) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:3000/api/users/profile",
        { email: formData.email },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser({ ...user, email: formData.email });
      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, email: formData.email })
      );
      setShowProfileForm(false);
      alert("Profile updated successfully");
    } catch (err) {
      alert("Error updating profile");
    }
  };

  const handleUpdatePassword = async (formData) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:3000/api/users/password",
        {
          current_password: formData.current_password,
          new_password: formData.new_password,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setShowProfileForm(false);
      alert("Password updated successfully");
    } catch (err) {
      alert("Error updating password");
    }
  };

  return (
    <div
      className="container mt-4"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <header className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-warning">CinemaScope Reviews</h1>
        {isLoggedIn && (
          <div>
            <button
              className="btn btn-warning me-2"
              onClick={() => setShowProfileForm(!showProfileForm)}
            >
              {showProfileForm ? "Close Profile" : "Update Profile/Password"}
            </button>
            <button className="btn btn-warning" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </header>

      {!isLoggedIn ? (
        <LoginForm onLogin={handleLogin} onRegister={handleRegister} />
      ) : (
        <>
          {showProfileForm && (
            <ProfileForm
              user={user}
              onUpdateProfile={handleUpdateProfile}
              onUpdatePassword={handleUpdatePassword}
            />
          )}

          <div className="mb-4">
            <button
              className="btn btn-warning me-2"
              onClick={() => setViewMode("movies")}
            >
              Movies
            </button>
            <button
              className="btn btn-warning me-2"
              onClick={() => setViewMode("allReviews")}
            >
              All Reviews
            </button>
            <button
              className="btn btn-warning me-2"
              onClick={() => setViewMode("myReviews")}
            >
              My Reviews
            </button>
            <button
              className="btn btn-warning"
              onClick={() => setViewMode("sharedReviews")}
            >
              Shared With Me
            </button>
            {viewMode === "movieReviews" && (
              <button
                className="btn btn-secondary ms-2"
                onClick={() => setViewMode("movies")}
              >
                Back to Movies
              </button>
            )}
          </div>

          {viewMode === "movies" && (
            <>
              <h2 className="text-warning mb-3">Movies</h2>
              <div className="row">
                {movies.map((movie) => (
                  <div className="col-md-4 mb-3" key={movie.movie_id}>
                    <MovieCard
                      movie={movie}
                      onAddReview={handleAddReview}
                      onShowReviews={() =>
                        fetchMovieReviews(
                          movie.movie_id,
                          localStorage.getItem("token")
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {viewMode === "allReviews" && (
            <>
              <h2 className="text-warning mb-3">All Reviews</h2>
              {allReviews.length > 0 ? (
                allReviews.map((review) => (
                  <ReviewCard
                    key={review.review_id}
                    review={review}
                    userId={user.id}
                    onEdit={handleEditReview}
                    onDelete={handleDeleteReview}
                    onShare={handleShareReview}
                  />
                ))
              ) : (
                <p className="text-light">No reviews available.</p>
              )}
            </>
          )}

          {viewMode === "myReviews" && (
            <>
              <h2 className="text-warning mb-3">My Reviews</h2>
              {myReviews.length > 0 ? (
                myReviews.map((review) => (
                  <ReviewCard
                    key={review.review_id}
                    review={review}
                    userId={user.id}
                    onEdit={handleEditReview}
                    onDelete={handleDeleteReview}
                    onShare={handleShareReview}
                  />
                ))
              ) : (
                <p className="text-light">No reviews yet.</p>
              )}
            </>
          )}

          {viewMode === "sharedReviews" && (
            <>
              <h2 className="text-warning mb-3">Shared With Me</h2>
              {sharedReviews.length > 0 ? (
                sharedReviews.map((review) => (
                  <ReviewCard
                    key={review.review_id}
                    review={review}
                    userId={user.id}
                    onEdit={handleEditReview}
                    onDelete={handleDeleteReview}
                    onShare={handleShareReview}
                  />
                ))
              ) : (
                <p className="text-light">No shared reviews.</p>
              )}
            </>
          )}

          {viewMode === "movieReviews" && (
            <>
              <h2 className="text-warning mb-3">
                Reviews for{" "}
                {movies.find((m) => m.movie_id === selectedMovieId)?.title}
              </h2>
              {movieReviews.length > 0 ? (
                movieReviews.map((review) => (
                  <ReviewCard
                    key={review.review_id}
                    review={review}
                    userId={user.id}
                    onEdit={handleEditReview}
                    onDelete={handleDeleteReview}
                    onShare={handleShareReview}
                  />
                ))
              ) : (
                <p className="text-light">No reviews for this movie.</p>
              )}
            </>
          )}

          {showAddReview && (
            <div
              className="modal show d-block"
              tabIndex="-1"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div className="modal-dialog">
                <div className="modal-content bg-dark text-light border-0">
                  <div className="modal-header border-0">
                    <h5 className="modal-title text-warning">Add Review</h5>
                    <button
                      type="button"
                      className="btn-close btn-close-white"
                      onClick={() => setShowAddReview(false)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <AddReviewForm onSubmit={handleSubmitReview} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {showEditReview && (
            <div
              className="modal show d-block"
              tabIndex="-1"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div className="modal-dialog">
                <div className="modal-content bg-dark text-light border-0">
                  <div className="modal-header border-0">
                    <h5 className="modal-title text-warning">Edit Review</h5>
                    <button
                      type="button"
                      className="btn-close btn-close-white"
                      onClick={() => setShowEditReview(false)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <AddReviewForm
                      onSubmit={handleUpdateReview}
                      initialReview={selectedReview}
                      isEditing={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {showShareModal && (
            <ShareReviewModal
              show={showShareModal}
              onHide={() => setShowShareModal(false)}
              reviewId={selectedReviewId}
            />
          )}
        </>
      )}
    </div>
  );
};

export default App;
