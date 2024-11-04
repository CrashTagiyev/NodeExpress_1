const express = require("express");
const cors = require("cors")
const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://127.0.0.1:5500"
}));

const {connectToDb} = require("./utils/database")
require("dotenv").config();

const authRoute = require("./routes/authRoutes")
const usersRoute = require("./routes/usersRoutes")
const toDosRoute = require("./routes/toDoRoutes")
const port =3000;
//----------------------------------------------------------------------------
connectToDb()

app.use("/auth",authRoute)
app.use("/users",usersRoute)
app.use("/toDos",toDosRoute)


// app.get("/items", (req, res, next) => {
//   try {
//     res.status(200).json(toDo);
//   } catch (error) {
//     console.error(error);
//   }
// });
// app.get("/items/:id", (req, res, next) => {
//   try {
//     const id = req.params.id;
//     if (toDo[id - 1] === undefined || toDo[id - 1] === null)
//       throw new Error("todo item with this id did not found");
      
//     res.status(200).send(toDo[id - 1]);
//   } catch (error) {
//     console.error(error);
//     res.status(404).send(error);
//   }
// });

// app.post(`/items/create`, (req, res, next) => {
//   const item = req.body.item;
//   toDo.push(item);
//   res.status(201).send(`New ToDo item is added to the list`);
// });

// app.put(`/items/edit/:id`, (req, res, next) => {
//   const id = req.params.id;
//   const editedToDo = req.body.editedItem;
//   toDo[id - 1] = editedToDo;
//   res.status(200).send(`Todo is successfuly edited`);
// });

// app.delete(`/items/delete/:id`, (req, res, next) => {
//   const id = req.params.id;
//   const filteredToDo = toDo.filter((item, index) => index !== id - 1);
//   toDo = filteredToDo;
//   res.status(200).send(`Todo item successfully deleted`);
// });


app.listen(port, () => {
  console.log(`server running on port:${port} `);
});
