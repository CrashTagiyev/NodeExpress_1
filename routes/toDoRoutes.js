const route = require("express").Router();
const ToDo = require("../models/toDoModel");
const url = require("url");

route.get("/", async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;
    
    const currentPage = parseInt(page);
    const currentPageSize = parseInt(pageSize);
    const toDosCount = await ToDo.countDocuments();
    const skip = (currentPage - 1) * currentPageSize;
    const totalPage = Math.ceil(toDosCount / currentPageSize)

    const toDos = await ToDo.find().skip(skip).limit(pageSize);
    res.status(200).json({ totalPage,currentPage,toDos });
  } catch (error) {
    console.error(error);
    res.status(500).send(`Internal server error`);
  }
});

route.get("/:id", async (req, res, next) => {
  try {
    const toDo = await ToDo.findById(req.params.id);
    res.status(200).json({ toDo });
  } catch (Error) {
    console.error(Error);
    res.status(500).send(`Internal server error`);
  }
});

route.get("/search/term", async (req, res, next) => {
  try {
    const { searchItem } = req.query;
    if (!searchItem) {
      return res.status(400).json({ error: "Search term is required" });
    }

    const toDos = await ToDo.find({
      $or: [
        { description: { $regex: searchItem, $options: "i" } },
        { title: { $regex: searchItem, $options: "i" } },
      ],
      ...(req.body.isCompleted !== undefined
        ? { isCompleted: { $eq: req.body.isCompleted } }
        : []),
    });

    res.status(200).json(toDos);
  } catch (error) {
    next(error);
  }
});

route.post("/create", async (req, res, next) => {
  try {
    const { title, description, author, isCompleted } = req.body;
    const newToDo = new ToDo({
      title,
      description,
      author,
      isCompleted: isCompleted ?? false,
    });
    await newToDo.save();
    res.status(204).json({ message: "ToDo deleted successfuly" });
  } catch (Error) {
    console.error(Error);
    res.status(500).send(`Internal server error`);
  }
});

route.put("/update/:id", async (req, res, next) => {
  try {
    const updatedToDo = await ToDo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    updatedToDo.save();
    if (!updatedToDo) res.status(404).send(`ToDo did not found`);

    res.status(203).send(`ToDo updated successfuly`);
  } catch (error) {
    res.status(500).send(`internal server error:${error}`);
    console.error(error);
  }
});

route.delete("/delete/:id", async (req, res, next) => {
  try {
    const toDos = await ToDo.findByIdAndDelete(req.params.id);
    res.status(204).json({ message: "ToDo deleted successfuly" });
  } catch (Error) {
    console.error(Error);
    res.status(500).send(`Internal server error`);
  }
});

module.exports = route;
