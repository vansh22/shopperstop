import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductDetail from "./ProductDetail";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const getUserData = async () => {
        const authToken = localStorage.getItem("token");
        try {
          const response = await axios.get(
            "http://localhost:5000/api/auth/getuser",
            {
              headers: {
                "auth-token": authToken,
              },
            }
          );
          setUserId(response.data._id);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      getUserData();
    } else {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/products/cart?userId=${userId}`,
          {
            headers: {
              "auth-token": authToken,
            },
          }
        );
        setCartItems(response.data);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };
    if (userId) {
      fetchData();
    }
  }, [userId]);

  return (
    <div className="container" style={{ marginTop: "6rem" }}>
      <div className="d-flex justify-content-between align-items-center">
        <h2>Your Cart</h2>
        {cartItems.length > 0 && (
          <Link to="/products" className="custom-btn mx-1 mb-2" role="button">
            Back to Explore
          </Link>
        )}
      </div>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 justify-content-center">
        {cartItems.length > 0 ? (
          cartItems.map((item) => {
            return (
              <div key={item._id} className="col-md-6 mb-4">
                <ProductDetail
                  quantity={item.quantity}
                  productId={item.productId}
                />
              </div>
            );
          })
        ) : (
          <div className="text-center" style={{ width: "100%" }}>
            <h2>Your cart is empty</h2>
            <h4 style={{ marginBottom: "4rem" }}>
              Add our exclusive range of products
            </h4>
            <Link to="/products" className="custom-btn">
              Explore Products
            </Link>
          </div>
        )}
      {/* <button className="custom-btn text-center mb-4" onClick={handleCheckout}>Checkout</button> */}
      </div>
    </div>
  );
};

export default Cart;
