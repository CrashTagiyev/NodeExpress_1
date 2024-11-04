const express = require("express");
const User = require("../models/userModel");
const ToDo = require("../models/toDoModel");
const route = express.Router();

route.get("/", async (req, res, next) => {
  const users = await User.find();
  console.log(users);
  res.json({ users });
});

route.get("/GetUsersToDosGt/term", async (req, res, next) => {
  const users = await User.find();
  const count = parseInt(req.query.count, 10);

  const filteredUsersPromises = users.map(async (user) => {
    const todoCount = await ToDo.countDocuments({ author: user._id });
    if (todoCount > count){
      return user
    }
    
  });
  const filteredUsers = await Promise.all(filteredUsersPromises);
  
  res.json({ filteredUsers });
});

route.get("/:id", (req, res, next) => {
  try {
    const user = User.findById(req.params.id);
    if (user) res.json(user);
  } catch (error) {
    console.log(error);
  }
});

route.delete("/delete/:id", async (req, res, next) => {
  try {
    const result = await User.findOneAndDelete(req.params.id);

    if (result) res.send(`User is deleted successfuly`);
    else throw new Error(`User did not found`);
  } catch (error) {
    console.error(error);
  }
});

route.put("/update/:id", async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedUser) res.status(404).send(`User did not found`);

    res.status(203).send(`User updated successfuly`);
  } catch (error) {
    res.status(500).send(`internal server error:${error}`);
    console.error(error);
  }
});

module.exports = route;
