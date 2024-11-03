const express = require("express");
const jwt = require("jsonwebtoken");
const route = express.Router();
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/tokenUtils");
const User = require("../models/userModel");

route.post("/register", async (req, res, next) => {
  try {
    const { userName, firstName, lastName, email, password } = req.body;
    const newUser = new User({
      userName,
      firstName,
      lastName,
      email,
      password,
    });
    await newUser.save();
    res.status(201).send("User is successfuly created");
  } catch (error) {
    console.error(error);
    res.send(`Internal Server Error occursed`);
  }
});

route.post("/login", async (req, res, next) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });

    if (user && (await user.comparePassword(password))) {
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      res.json({ accessToken, refreshToken });
    } else res.json({ message: "invalid credentials" });
  } catch (error) {
    console.error(error);
  }
});

route.get("/refresh", async (req, res, next) => {
  const refreshToken = req.body.refreshToken;
  const decodedToken = verifyRefreshToken(refreshToken);
  if (decodedToken) {
    const user = await User.findById(decodedToken.id);
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.json({
      accessToken,
      refreshToken,
    });
  }
});

module.exports = route;
