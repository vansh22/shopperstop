const express = require("express");
const router = express.Router();
const path = require("path");

const Product = require("../models/Product");
const Cart = require("../models/Cart");

// ROUTE 1 : Get the products - localhost:5000/api/products/getproducts
router.get("/getproducts", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ROUTE 2 : Get a product using its id - localhost:5000/api/products/get-a-product
router.get("/get-a-product", async (req, res) => {
  const { productId } = req.query;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ROUTE 3 : Retrieve the cart - localhost:5000/api/products/cart
router.get("/cart", async (req, res) => {
  const {userId}= req.query;
  
  try {
    const cartItems = await Cart.findOne({ userId })

    if (!cartItems) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.json(cartItems.items);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ROUTE 4 : Add Product to Cart - localhost:5000/api/products/add-to-cart
router.post("/add-to-cart", async (req, res) => {
  const { userId, productId, quantity } = req.body;

  // console.log(typeof userId);
  // console.log(typeof productId);
  // console.log(typeof quantity);

  try {
    let cart = await Cart.findOne({ userId });

    const validProductId = productId;

    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId: validProductId, quantity }],
      });
      await cart.save();
    } else {
      const existingItem = cart.items.find(
        (item) => item.productId.equals(validProductId)
      );
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ productId: validProductId, quantity });
      }
      await cart.save();
    }

    res.json({ success: true, message: "Product added to cart successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error adding product to cart" });
  }
});

// ROUTE 5 : Delete the cart - localhost:5000/api/products/delete-cart
router.delete("/delete-cart", async (req, res) => {
  const { userId } = req.body;
  console.log(userId);

  try {
    let cart = await Cart.findOne({ userId });
    console.log(cart);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Remove the cart from the database
    await Cart.deleteOne({ userId });

    res.status(200).json({ message: "Cart deleted successfully" });
  } catch (error) {
    console.error("Error deleting cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ROUTE 6 : Increment the quantity - localhost:5000/api/products/increment-quantity
router.post("/increment-quantity", async (req, res) => {
  const { userId, productId } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find((item) => item.productId.equals(productId));

    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    item.quantity += 1;
    await cart.save();

    res.json({ success: true, message: "Quantity incremented successfully" });
  } catch (error) {
    console.error("Error incrementing quantity:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ROUTE 7 : Decrement the quantity - localhost:5000/api/products/decrement-quantity
router.post("/decrement-quantity", async (req, res) => {
  const { userId, productId } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find((item) => item.productId.equals(productId));

    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      cart.items = cart.items.filter(
        (item) => item.productId.toString() !== productId
      );
    }

    await cart.save();

    res.json({ success: true, message: "Quantity decremented successfully" });
  } catch (error) {
    console.error("Error decrementing quantity:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
