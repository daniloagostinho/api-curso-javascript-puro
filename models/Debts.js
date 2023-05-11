const mongoose = require("mongoose");

const Debts = mongoose.model("Debts", {
  user: {
    title: String,
    date: String,
    month: {
      title: String,
      year: String,
      listMonth: {
        debt: String,
        category: String,
        value: String,
        dueDate: String,
      },
    },
  },
});

module.exports = Debts;
