const mongoose = require("mongoose");

const User = mongoose.model("User", {
  name: String,
  email: String,
  gender: String,
  image: String,
  password: String,
});

module.exports = User;
