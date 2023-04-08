const mongoose = require("mongoose");

const Revenues = mongoose.model("Revenues", {
  user: {
    title: String,
    month: {
      title: String,
      listMonth: {
        category: String,
        value: String,
        dateEntry: String,
      },
    },
  },
});

module.exports = Revenues;
