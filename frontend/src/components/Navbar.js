import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Logo from "../assets/navbar/logo.png";
import Cart from "../assets/navbar/cart.png";

function Navbar({ showAlert, cartCount, name, setSearch }) {
  const [userLocation, setUserLocation] = useState("");

  // Function to get user's location
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Use reverse geocoding to get the state from the latitude and longitude
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          )
            .then((response) => response.json())
            .then((data) => {
              const state = data.principalSubdivision;
              setUserLocation(state);
            })
            .catch((error) => {
              console.error("Error fetching user location:", error);
            });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    showAlert("Logged out successfully.", "success");
    navigate("/login");
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary" id="navbar">
        <div className="container-fluid d-flex justify-content-between">
          <div className="d-flex">
            <Link className="navbar-brand" to="/">
              <img
                src={Logo}
                alt="Logo"
                style={{ width: "50px", height: "auto" }}
              />
              &nbsp;&nbsp;ShopperStop
            </Link>
            <p className="m-2 d-flex justify-content-center align-items-center">
              {userLocation}, India
            </p>
          </div>
          <button
            className="navbar-toggler hamburger-icon"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          {localStorage.getItem("token") && (
            <form
              className="search-box"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <button type="submit">Search</button>
              <input
                type="search"
                name="search"
                id="search"
                placeholder="Search for Products, Brands and More"
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                className="focus"
              />
            </form>
          )}
          <div className="d-flex">
            <div className="btn btn-light border">
              <Link className="nav-link" to="/cart">
                <img
                  src={Cart}
                  alt="Cart"
                  style={{
                    width: "30px",
                    height: "auto",
                    marginRight: "5px",
                  }}
                />
                <span>{cartCount}</span>
              </Link>
            </div>
            <div className="d-flex align-items-center justify-content-center">
              {!localStorage.getItem("token") ? (
                <div className="d-flex">
                  <Link className="custom-btn mx-1" to="/login" role="button">
                    Login <i className="fa-solid fa-right-to-bracket mx-2"></i>
                  </Link>
                  <Link className="custom-btn mx-1" to="/signup" role="button">
                    Signup <i className="fa-solid fa-right-to-bracket mx-2"></i>
                  </Link>
                </div>
              ) : (
                <div className="d-flex">
                  <p className="m-2 d-flex justify-content-center align-items-center">
                    Hello, {name}
                  </p>
                  <button className="custom-btn" onClick={handleLogout}>
                    Logout{" "}
                    <i className="fa-solid fa-arrow-right-from-bracket mx-2"></i>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
