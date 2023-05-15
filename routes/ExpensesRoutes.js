const router = require("express").Router();

const expensesController = require("../controllers/ExpensesController");

router.post("/auth/expenses", expensesController.registerexpenses);
router.get("/list/expenses", expensesController.listExpenses);
router.put("/update/expenses/:id", expensesController.updateExpenses);
router.delete("/delete/expense/:id", expensesController.deleteExpenses);
router.get("/expenses/extrato", expensesController.getExpenseStatement);

module.exports = router;
