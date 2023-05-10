const mongoose = require("mongoose");

const incomes = mongoose.model("Incomes", {
  user: {
    title: String,
    month: {
      title: String,
      listMonth: {
        income: String,
        value: String,
        dueDate: String,
        paymentMethod: String,
      },
    },
  },
});

module.exports = incomes;
