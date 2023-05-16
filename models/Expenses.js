const mongoose = require("mongoose");

const expenses = mongoose.model("expenses", {
  user: {
    title: String,
    date: String,
    month: {
      title: String,
      year: String,
      listMonth: {
        expense: String,
        category: String,
        value: String,
        dueDate: String,
      },
    },
  },
});

module.exports = expenses;
