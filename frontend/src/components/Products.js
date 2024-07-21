import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Products = ({ IncreaseCartCount, DecreaseCartCount, search }) => {
  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState("");
  const [cartProducts, setCartProducts] = useState({});
  const navigate = useNavigate();
  // Cart products stores data in the format : {65f7fa7cfabb5a3730b4717d: 2, 65f7fa7cfabb5a3730b4717f: 1}

  // Get the userId
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    } else {
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
    }
    // eslint-disable-next-line
  }, []);

  // Get the cart of the user to persist the change between renders and reloads
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
        const newCartProducts = {};
        response.data.forEach((item) => {
          newCartProducts[item.productId] = item.quantity;
        });
        setCartProducts(newCartProducts);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };
    if (userId) {
      fetchData();
    }
  }, [userId]);

  // Get all the products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/products/getproducts"
        );
        setProducts(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, []);

  const [filteredProducts, setFilteredProducts] = useState([]);

  // Filter products based on search input and category
  useEffect(() => {
    const handleSearch = () => {
      const filteredProducts = products.filter((product) => {
        const categoryMatch = product.category
          .toLowerCase()
          .includes(search.toLowerCase());
        return categoryMatch;
      });
      setFilteredProducts(filteredProducts);
    };
    handleSearch();
  }, [products, search]);

  // Cart functionality - add, delete, increment, decrement
  const addToCart = async (productId) => {
    IncreaseCartCount();
    // console.log(`Product added to cart: ${productId}`);
    setCartProducts((prevCartProducts) => ({
      ...prevCartProducts,
      [productId]: (prevCartProducts[productId] || 0) + 1,
    }));
    try {
      const authToken = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/products/add-to-cart",
        {
          userId,
          productId,
          quantity: 1,
        },
        {
          headers: {
            "auth-token": authToken,
          },
        }
      );
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const removeFromCart = async (productId) => {
    DecreaseCartCount();
    const updatedCartProducts = { ...cartProducts };
    delete updatedCartProducts[productId];
    setCartProducts(updatedCartProducts);

    if (!cartProducts) {
      try {
        const authToken = localStorage.getItem("token");
        const response = await axios.delete(
          "http://localhost:5000/api/products/delete-cart",
          {
            data: { userId }, // Send userId in the request body
            headers: {
              "auth-token": authToken,
            },
          }
        );
        console.log(response.data.message);
      } catch (error) {
        console.error("Error deleting the cart:", error);
      }
    }
  };

  const incrementQuantity = async (productId) => {
    setCartProducts((prevCartProducts) => ({
      ...prevCartProducts,
      [productId]: (prevCartProducts[productId] || 0) + 1,
    }));

    try {
      const authToken = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/products/increment-quantity",
        {
          userId,
          productId,
        },
        {
          headers: {
            "auth-token": authToken,
          },
        }
      );
    } catch (error) {
      console.error("Error incrementing quantity:", error);
    }
  };

  const decrementQuantity = async (productId) => {
    if (cartProducts[productId] > 1) {
      setCartProducts((prevCartProducts) => ({
        ...prevCartProducts,
        [productId]: prevCartProducts[productId] - 1,
      }));
    } else {
      removeFromCart(productId);
    }

    try {
      const authToken = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/products/decrement-quantity",
        {
          userId,
          productId,
        },
        {
          headers: {
            "auth-token": authToken,
          },
        }
      );
    } catch (error) {
      console.error("Error decrementing quantity:", error);
    }
  };

  return (
    <div className="container products-container"> {/* Added products-container class */}
      <h2 className="my-4 text-center lato-regular">
        Explore Our Diverse Range of Products
      </h2>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 justify-content-center">
        {filteredProducts.map((product) => (
          <div key={product._id} className="col">
            <div className="card h-100 text-center product-card"> 
              <img
                src={product.image}
                className="card-img-top"
                alt={product.category}
                style={{ maxHeight: "300px", objectFit: "cover" }}
              />
              <div className="card-body d-flex flex-column justify-content-center">
                <h5 className="card-title">{product.category}</h5>
                <p className="card-text">Price: ${product.price}</p>
                {cartProducts[product._id] ? (
                  <div className="d-flex align-items-center justify-content-center btn">
                    <button
                      className="btn btn-secondary me-2"
                      onClick={() => decrementQuantity(product._id)}
                    >
                      -
                    </button>
                    <button className="btn btn-light me-2" disabled>
                      {cartProducts[product._id]}
                    </button>
                    <button
                      className="btn btn-secondary me-2"
                      onClick={() => incrementQuantity(product._id)}
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={() => addToCart(product._id)}
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
