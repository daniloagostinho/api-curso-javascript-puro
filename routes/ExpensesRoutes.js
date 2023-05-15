const router = require("express").Router();

const expensesController = require("../controllers/ExpensesController");

router.post("/auth/expenses", expensesController.registerexpenses);
router.get("/list/expenses", expensesController.listexpenses);
router.put("/update/expenses/:id", expensesController.updateexpenses);
router.delete("/delete/expense/:id", expensesController.deleteexpenses);
router.get("/expenses/extrato", expensesController.getexpenseStatement);

module.exports = router;
