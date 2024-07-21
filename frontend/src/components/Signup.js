import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = ({ showAlert }) => {
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
    phone: "",
  });
  let navigate = useNavigate();

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, cpassword, phone } = credentials;
    // Phone number validation regex pattern
    const phonePattern = /^[0-9]{10}$/;

    // Check if phone number is provided and matches the pattern
    if (phone && !phone.match(phonePattern)) {
      showAlert("Invalid phone number format.", "danger");
      return;
    }

    // Ensure phone number is sent as null if not provided
    const phoneToSend = phone ? phone : null;
    if (password !== cpassword) showAlert("Passwords do not match.", "danger");
    else {
      const response = await fetch(
        `http://localhost:5000/api/auth/createuser`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            phone: phoneToSend,
          }),
        }
      );
      const json = await response.json();
      if (json.success) {
        // Set the auth token and redirect
        localStorage.setItem("token", json.authtoken);
        showAlert("Signed up successfully.", "success");
        navigate("/login");
      } else {
        const errors = json.errors;
        errors.forEach(element => {
          showAlert(element.msg, "danger");
        });
      }
    }
  };

  const handleOnChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="container" style={{ margin: "5rem auto 5rem auto" }}>
      <form onSubmit={handleOnSubmit}>
        <h2>Create an account to use ShopperStop</h2>
        <div className="my-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <span className="required">*</span>
          <input
            type="text"
            className="form-control"
            name="name"
            id="name"
            aria-describedby="emailHelp"
            onChange={handleOnChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">
            Phone
          </label>
          <input
            type="tel"
            className="form-control"
            name="phone"
            id="phone"
            onChange={handleOnChange}
          />
        </div>
        <div className="mb-3">
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
            onChange={handleOnChange}
            required
          />
          <div id="emailHelp" className="form-text">
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
            name="password"
            id="password"
            onChange={handleOnChange}
            minLength={5}
            required
          />
          <div id="passHelp" className="form-text">
            Your password is secure and end to end encrypted.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">
            Confirm Password
          </label>
          <span className="required">*</span>
          <input
            type="password"
            className="form-control"
            name="cpassword"
            id="cpassword"
            onChange={handleOnChange}
            minLength={5}
            required
          />
        </div>
        <button type="submit" className="custom-btn">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Signup;
