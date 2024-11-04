const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    maxLenght: 100,
    unique: [true, "This email is already exist"]
  },
  password: {
    type: String,
    required: true,
    minLenght: 8
  },

});

userSchema.pre(`save`, async function (next) {
  if (!this.isModified(`password`)) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};


const User = mongoose.model("User", userSchema);

module.exports = User;
