import React, { useState, useEffect } from "react";
import axios from "axios";

const ShareReviewModal = ({ show, onHide, reviewId }) => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    if (show) {
      const token = localStorage.getItem("token");
      axios
        .get("http://localhost:3000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUsers(res.data));
    }
  }, [show]);

  const handleShare = () => {
    const token = localStorage.getItem("token");
    axios
      .post(
        "http://localhost:3000/api/shares",
        {
          review_id: reviewId,
          user_ids: selectedUsers,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        alert("Review shared successfully");
        onHide();
      })
      .catch((err) => alert("Error sharing review"));
  };

  const handleCheckboxChange = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  if (!show) return null;

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content bg-dark text-light border-0">
          <div className="modal-header border-0">
            <h5 className="modal-title text-warning">Share Review</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onHide}
            ></button>
          </div>
          <div className="modal-body">
            {users.map((user) => (
              <div key={user.user_id} className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`user-${user.user_id}`}
                  onChange={() => handleCheckboxChange(user.user_id)}
                />
                <label
                  className="form-check-label"
                  htmlFor={`user-${user.user_id}`}
                >
                  {user.email}
                </label>
              </div>
            ))}
          </div>
          <div className="modal-footer border-0">
            <button className="btn btn-secondary" onClick={onHide}>
              Close
            </button>
            <button className="btn btn-warning" onClick={handleShare}>
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareReviewModal;
