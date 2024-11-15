const mongoose = require("mongoose");

const basketSchema = new mongoose.Schema({
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
        min: 1,
        default: 1,
      },
    },
  ],
  totalPrice: {
    type: Number,
    default:0
  },
  currency: {
    type: String,
    enum: ["$", "€", "₼"],
  },
  status: {
    type: String,
    enum: ["pending", "cancelled", "confirmed"],
    default: "pending",
  },
});

const Basket = mongoose.model("Basket", basketSchema);

module.exports = Basket;
