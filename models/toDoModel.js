const mongoose = require("mongoose");

const toDoSchema = new mongoose.Schema({
  title: {
    type: String,
    reqired: true,
  },
  description: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isCompleted: {
    type: Boolean,
    required: true,
    default: false,
  },
  lastUpdated: {
    type: Date,
    default: Date.now(),
  },
});

toDoSchema.pre(`save`, async function (next) {
  this.lastUpdated = Date.now();
  next();
});
toDoSchema.index({ description: "text" });

const ToDo = mongoose.model("Todo", toDoSchema);

module.exports = ToDo;
