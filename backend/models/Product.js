const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProductSchema = new Schema({
  name:{
    type: String,
    required: true,
  },
  image:{
    type: String,
    required: true,
  },
  category:{
    type: String,
    required: true,
  },
  price:{
    type: Number,
    required: true,
  },
  date:{
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("products", ProductSchema);
module.exports = Product;
