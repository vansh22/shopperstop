const mongoose = require("mongoose");
const { Schema } = mongoose;
const cartSchema = Schema({
  userId: String,
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: Number,
    },
  ],
});

const Cart = mongoose.model("cart", cartSchema);
module.exports = Cart;
