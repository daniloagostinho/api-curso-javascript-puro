const mongoose = require("mongoose");

const incomes = mongoose.model("Incomes", {
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

module.exports = incomes;
