const ToDo = require("../models/toDoModel");

const GetUsersToDosCount = async (id) => {
  const ToDos = await ToDo.find({
    author: id,
  });

  return ToDos.length
};

module.exports = GetUsersToDosCount;