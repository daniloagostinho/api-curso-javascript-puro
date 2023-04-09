const mongoose = require("mongoose");

const incomes = mongoose.model("Incomes", {
  user: {
    title: String,
    month: {
      title: String,
      listMonth: {
        income: String,
        value: String,
        dateEntry: String,
      },
    },
  },
});

module.exports = incomes;
