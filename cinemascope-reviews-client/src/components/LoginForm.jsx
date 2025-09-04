import React, { useState } from "react";

const LoginForm = ({ onLogin, onRegister }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    onLogin(formData.email, formData.password);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    onRegister(formData.email, formData.password);
  };

  return (
    <div className="d-flex justify-content-center">
      <div
        className="p-4 bg-dark text-light rounded shadow"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <h2 className="text-warning mb-3 text-center">
          CinemaScope Authentication
        </h2>
        <form>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control bg-secondary text-light border-0"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control bg-secondary text-light border-0"
              required
            />
          </div>
          <div className="d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-warning w-45"
              onClick={handleLoginSubmit}
            >
              Login
            </button>
            <button
              type="button"
              className="btn btn-warning w-45"
              onClick={handleRegisterSubmit}
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
