import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ showAlert }) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  let navigate = useNavigate();

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`https://shopperstop-server.onrender.com/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });
    const json = await response.json();
    if (json.success) {
      // Set the auth token and redirect
      localStorage.setItem("token", json.authtoken);
      showAlert("Logged in successfully.", "success");
      navigate("/products");
    } else {
      showAlert("Invalid credentials.", "danger");
    }
  };

  const handleOnChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="container" style={{marginTop: "5rem"}}>
      <form onSubmit={handleOnSubmit} className="mt-3">
        <h2>Login to continue to ShopperStop</h2>
        <div className="my-4">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <span className="required">*</span>
          <input
            type="email"
            className="form-control"
            name="email"
            id="email"
            aria-describedby="emailHelp"
            value={credentials.email}
            onChange={handleOnChange}
            required
          />
          <div id="email" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <span className="required">*</span>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleOnChange}
            minLength={5}
            required
          />
          <div id="passHelp" className="form-text">
            Your password is secure and end to end encrypted.
          </div>
        </div>
        <button type="submit" className="custom-btn">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Login;
