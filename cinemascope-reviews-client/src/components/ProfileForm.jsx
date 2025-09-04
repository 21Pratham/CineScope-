import React, { useState } from "react";

const ProfileForm = ({ user, onUpdateProfile, onUpdatePassword }) => {
  const [profileData, setProfileData] = useState({ email: user.email });
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    onUpdateProfile(profileData);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      alert("New passwords do not match");
      return;
    }
    onUpdatePassword(passwordData);
  };

  return (
    <div className="p-4 bg-dark text-light rounded shadow mb-4">
      <h3 className="text-warning mb-3">Update Profile</h3>
      <form onSubmit={handleProfileSubmit} className="mb-4">
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            value={profileData.email}
            onChange={handleProfileChange}
            className="form-control bg-secondary text-light border-0"
            required
          />
        </div>
        <button type="submit" className="btn btn-warning">
          Update Profile
        </button>
      </form>

      <h3 className="text-warning mb-3">Update Password</h3>
      <form onSubmit={handlePasswordSubmit}>
        <div className="mb-3">
          <label className="form-label">Current Password</label>
          <input
            type="password"
            name="current_password"
            value={passwordData.current_password}
            onChange={handlePasswordChange}
            className="form-control bg-secondary text-light border-0"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">New Password</label>
          <input
            type="password"
            name="new_password"
            value={passwordData.new_password}
            onChange={handlePasswordChange}
            className="form-control bg-secondary text-light border-0"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Confirm New Password</label>
          <input
            type="password"
            name="confirm_password"
            value={passwordData.confirm_password}
            onChange={handlePasswordChange}
            className="form-control bg-secondary text-light border-0"
            required
          />
        </div>
        <button type="submit" className="btn btn-warning">
          Update Password
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;
