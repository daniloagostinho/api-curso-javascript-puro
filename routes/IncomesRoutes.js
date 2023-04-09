const router = require("express").Router();

const incomesController = require("../controllers/IncomesController")

router.post("/auth/incomes", incomesController.registerincomes);
router.get("/list/incomes", incomesController.listincomes);
router.put("/update/incomes/:id", incomesController.updateincomes);
router.delete("/delete/income/:id", incomesController.deleteIncome);

module.exports = router;
