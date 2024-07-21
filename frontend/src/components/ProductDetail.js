import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductDetail = ({ quantity, productId }) => {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `https://shopperstop-server.onrender.com/api/products/get-a-product?productId=${productId}`
        );
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [productId]);
  return (
    <>
      {product ? (
        <div className="card h-100 text-center">
          <img
            src={product.image}
            className="card-img-top"
            alt={product.category}
            style={{ maxHeight: "300px", objectFit: "cover" }}
          />
          <div className="card-body d-flex flex-column justify-content-center">
            <h5 className="card-title">{product.category}</h5>
            <p className="card-text">Total Price: ${quantity * product.price}</p>
            <p className="card-text">Quantity: {quantity}</p>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default ProductDetail;
