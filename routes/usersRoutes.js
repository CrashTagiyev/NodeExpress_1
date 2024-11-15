const express = require("express");
const User = require("../models/userModel");
const route = express.Router();
const { verifyAccessToken, verifyIsAdmin } = require("../utils/tokenUtils");
route.get("/", async (req, res) => {
  const users = await User.find();
  console.log(users);
  res.json({ users });
});

route.get("/:id", verifyAccessToken, (req, res) => {
  try {
    const user = User.findById(req.params.id);
    if (user) res.json(user);
  } catch (error) {
    console.log(error);
  }
});

route.delete(
  "/delete/:id",
  verifyAccessToken,
  verifyIsAdmin,
  async (req, res) => {
    try {
      const result = await User.findOneAndDelete(req.params.id);

      if (result) res.send(`User is deleted successfuly`);
      else throw new Error(`User did not found`);
    } catch (error) {
      console.error(error);
    }
  }
);

route.put(
  "/update/:id",
  verifyAccessToken,
  verifyIsAdmin,
  async (req, res) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );
      if (!updatedUser) res.status(404).send(`User did not found`);

      res.status(203).send(`User updated successfuly`);
    } catch (error) {
      res.status(500).send(`internal server error:${error}`);
      console.error(error);
    }
  }
);

module.exports = route;
