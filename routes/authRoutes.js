const express = require("express");
const jwt = require("jsonwebtoken");
const formidable = require("formidable");
const fs = require("fs");
const route = express.Router();
const {
  verifyAccessToken,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/tokenUtils");
const User = require("../models/userModel");

route.post("/register", async (req, res, next) => {
  try {
    const {
      userName,
      firstName,
      lastName,
      email,
      password,
      isAdmin = false,
    } = req.body;
    const newUser = new User({
      userName,
      firstName,
      lastName,
      email,
      password,
      basket: null,
      isAdmin,
    });
    await newUser.save();

    res.status(201).send("User is successfuly created");
  } catch (error) {
    console.error(error);
    res.send(`Internal Server Error occursed`);
  }
});

route.post("/login", async (req, res) => {
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

route.get("/refresh", async (req, res) => {
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

route.post("/addImages", async (req, res) => {
  try {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (files.profileImage[0] && files.profileImage[0].filepath) {
        files.profileImage.map((img) => {
          const imageData = fs.readFileSync(img.filepath);

          const imgOriginalName = img.originalFilename.split(".")[0];
          const fileExtension = img.originalFilename.split(".")[1];
          const newImageName = `${imgOriginalName}+${Date.now()}.${fileExtension}`;
          const newPath = `./images/${newImageName}`;

          fs.writeFileSync(newPath, imageData);
        });
        res.send("image added successfuly")
      }
       else throw new Error("file does not exist in the temp folder");
    });
  } catch (err) {
    console.error(err);
  }
});

module.exports = route;
