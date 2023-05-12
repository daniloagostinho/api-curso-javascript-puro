const mongoose = require("mongoose");

const piggyBankSchema = new mongoose.Schema({
    balance: {
        type: Number,
        default: 0,
    },
});

const PiggyBank = mongoose.model("PiggyBank", piggyBankSchema);

module.exports = PiggyBank;
