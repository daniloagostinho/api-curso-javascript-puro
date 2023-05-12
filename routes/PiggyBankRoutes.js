const router = require("express").Router();

const piggyBankController = require("../controllers/PiggyBankController")

router.post("/auth/add/piggy/bank", piggyBankController.addToPiggyBank);
router.get("/list/piggy/bank", piggyBankController.getPiggyBankBalance);

module.exports = router;
