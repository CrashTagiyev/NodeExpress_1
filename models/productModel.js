const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    require: true,
  },
  currency: {
    type: String,
    enum: ["$", "€", "₼"],
  },
  category: {
    type: String,
    enum: ["Tech", "Fashion", "Vehical"],
  },
  stock: {
    type: Number,
    min: 0,
    default: 0,
  },
  gallery: {
    type: [String],
  },
});


const Product = mongoose.model("Product", productSchema);

module.exports = Product;
