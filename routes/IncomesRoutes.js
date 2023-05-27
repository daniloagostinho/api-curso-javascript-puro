const router = require("express").Router();

const incomesController = require("../controllers/IncomesController")

router.post("/auth/incomes", incomesController.registerIncomes);
router.get("/list/incomes", incomesController.listIncomes);
router.put("/update/incomes/:id", incomesController.updateIncomes);
router.delete("/delete/income/:id", incomesController.deleteIncome);
router.get("/incomes/extract", incomesController.getIncomeStatement);

module.exports = router;
