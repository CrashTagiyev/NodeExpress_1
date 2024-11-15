const Product = require("../models/productModel");
const { verifyIsAdmin, verifyAccessToken } = require("../utils/tokenUtils");

const route = require("express").Router();

route.get("/", async (req, res) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;
    const currentPage = parseInt(page);
    const currentPageSize = parseInt(pageSize);
    const Count = await Product.countDocuments();
    const skip = (currentPage - 1) * currentPageSize;
    const totalPage = Math.ceil(Count / currentPageSize);

    const products = await Product.find().skip(skip).limit(pageSize);
    res.status(200).json({ totalPage, currentPage, products });
  } catch (error) {
    console.error(error);
  }
});

route.post("/create", verifyAccessToken, verifyIsAdmin, async (req, res) => {
  try {
    const { title, description, price, currency, category, stock, gallery } =
      req.body;
    const newProduct = new Product({
      title,
      description,
      price,
      currency,
      category,
      stock,
      gallery,
    });
    await newProduct.save();
    res.send("Product created succesfully");
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
      const updatingProduct = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );
      await updatingProduct.save();
      if (!updatingProduct) res.status(404).send(`ToDo did not found`);

      res.status(203).send(`ToDo updated successfuly`);
    } catch (err) {
      json.send(err);
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
      await Product.findByIdAndDelete(req.params.id);

      res.status(203).send(`ToDo updated successfuly`);
    } catch (err) {
      json.send(err);
      console.error(err);
    }
  }
);

module.exports = route;
