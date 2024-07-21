import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./components/Signup";
import { useEffect, useState } from "react";
import Alert from "./components/Alert";
import Login from "./components/Login";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Products from "./components/Products";
import Cart from "./components/Cart";
import axios from "axios";

function App() {
  const [alert, setAlert] = useState(null);
  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 2000);
  };
  const [cartCount, setCartCount] = useState(0);
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");

  // Functions to update cart count
  const IncreaseCartCount = () => {
    setCartCount((prevCount) => prevCount + 1);
  };
  const DecreaseCartCount = () => {
    setCartCount((prevCount) => prevCount - 1);
  };

  // Get the user data - name
  useEffect(() => {
    if (localStorage.getItem("token")) {
      const authToken = localStorage.getItem("token");
      const getUserData = async () => {
        const response = await fetch("https://shopperstop-server.onrender.com/api/auth/getuser", {
          method: "GET",
          headers: {
            "auth-token": authToken,
          },
        });
        const json = await response.json();
        setUserId(json._id);
        setName(json.name);
      };
      getUserData();
    }
    // eslint-disable-next-line
  }, [userId]);

  // Get the cart of the user to persist the change between renders and reloads
  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = localStorage.getItem("token");
        const response = await axios.get(
          `https://shopperstop-server.onrender.com/api/products/cart?userId=${userId}`,
          {
            headers: {
              "auth-token": authToken,
            },
          }
        );
        setCartCount(response.data.length);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };
    if (userId) {
      fetchData();
    }
  }, [userId, setCartCount]);

  return (
    <>
      <Router>
        <Navbar
          showAlert={showAlert}
          cartCount={cartCount}
          name={name}
          setSearch={setSearch}
        />
        <Alert alert={alert} />
        <Routes>
          <Route exact path="/" element={<Home showAlert={showAlert} />} />
          <Route
            exact
            path="/products"
            element={
              <Products
                IncreaseCartCount={IncreaseCartCount}
                DecreaseCartCount={DecreaseCartCount}
                search={search}
              />
            }
          />
          <Route exact path="/cart" element={<Cart/>} />
          <Route
            exact
            path="/signup"
            element={<Signup showAlert={showAlert} />}
          />
          <Route
            exact
            path="/login"
            element={<Login showAlert={showAlert} />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
