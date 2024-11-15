const Basket = require("../models/basketModel");
const route = require("express").Router();
const { verifyAccessToken, verifyIsAdmin } = require("../utils/tokenUtils");

route.get("/", verifyAccessToken, async (req, res) => {
  try {
    const baskets = await Basket.find();
    res.json(baskets);
  } catch (err) {
    res.send(err);
    console.error(err);
  }
});

route.get("/:id", verifyAccessToken, async (req, res) => {
  try {
    const basket = await Basket.findById(req.params.id);
    if (basket) res.json(basket);
    else res.statusCode(404);
  } catch (err) {
    res.send(err);
    console.error(err);
  }
});

route.post("/create", verifyAccessToken, verifyIsAdmin, async (req, res) => {
  try {
    const { products, totalPrice, currency, status } = req.body;
    const newBasket = new Basket({
      products,
      totalPrice,
      currency,
      status,
    });
    await newBasket.save();
    res.sendStatus(201);
  } catch (err) {
    res.send(err);
    console.error(err);
  }
});

route.patch(
  "/update/:id",
  verifyAccessToken,
  verifyIsAdmin,
  async (req, res) => {
    try {
      const basket = await Basket.findByIdAndUpdate(req.params.id, req.body);
      if (basket) res.sendStatus(200);
      else res.sendStatus(404);
    } catch (err) {
      res.send(err);
      console.error(err);
    }
  }
);

route.delete(
  "/delete/:id",
  verifyAccessToken,
  verifyIsAdmin,
  async (req, res) => {
    try {
      await Basket.findByIdAndDelete(req.params.id);
      res.sendStatus(200);
    } catch (err) {
      res.send(err);
      console.error(err);
    }
  }
);

route.patch("/addProduct/:id",verifyAccessToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const basket = await Basket.findById(req.params.id);
    if (!basket) res.sendStatus(404);

    basket.products.push({
      productId: productId,
      quantity: quantity,
    });

    await basket.save();
    res.sendStatus(200);
  } catch (err) {
    res.send(err);
    console.error(err);
  }
});

module.exports = route;
