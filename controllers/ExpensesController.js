const Expenses = require("../models/Expenses");

module.exports = class expensesController {
  static async registerExpenses(req, res) {
    const title = req.body.user.month.title;
    const user = req.body.user.title;
    const date = req.body.user.date;
    const year = req.body.user.month.year

    const { expense, category, value, dueDate } =
      req.body.user.month.listMonth;

    if (!expense) {
      return res.status(422).json({ message: "A dívida é obrigatório!" });
    }

    if (!category) {
      return res.status(422).json({ message: "A categoria é obrigatório!" });
    }

    if (!value) {
      return res.status(422).json({ message: "O valor é obrigatório!" });
    }


    if (!year) {
      return res.status(422).json({ message: "O ano é obrigatório!" });
    }


    if (!dueDate) {
      return res
        .status(422)
        .json({ message: "A data de expiração é obrigatório!" });
    }

    const expenses = new Expenses({
      user: {
        title: user,
        date,
        month: {
          title,
          year,
          listMonth: {
            expense,
            category,
            value,
            dueDate
          },
        },
      },
    });

    try {
      await expenses.save();
      res
        .status(201)
        .json({ message: "Cadastro de dívida realizado com sucesso!" });
    } catch (error) {
      res.status(500).json({ message: "Erro ao cadastrar dívida!" });
    }
  }

  static async listExpenses(req, res) {
    const { month, year } = req.headers;

    const user = req.headers.user;
    try {
      let list = await Expenses.find({ "user.month.year": year, "user.month.title": month, "user.title": user });
      const result = list.map((el) => {
        return {
          user: {
            title: el.user.title,
            month: {
              title: el.user.month.title,
              listMonth: {
                _id: el._id.toString(),
                expense: el.user.month.listMonth.expense,
                category: el.user.month.listMonth.category,
                value: el.user.month.listMonth.value,
                dueDate: el.user.month.listMonth.dueDate,
                actions: [
                  "https://raw.githubusercontent.com/daniloagostinho/curso-javascript/main/src/assets/images/edit.png",
                  "https://raw.githubusercontent.com/daniloagostinho/curso-javascript/main/src/assets/images/delete.png",
                ],
              },
            },
          },
        };
      });

      res.status(200).json({ result });
    } catch (error) {
      res.status(500).json({ message: "Erro ao listar as dívidas!" });
    }
  }


  static async updateExpenses(req, res) {
    try {
      const id = req.params.id;
      const user = await Expenses.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ message: "Erro au atualizar dívida!" });
    }
  }

  static async deleteExpenses(req, res) {
    try {
      const id = req.params.id;
      const deleteExpenses = await Expenses.findByIdAndDelete(id);

      if (deleteExpenses) {
        res
          .status(200)
          .json({ messagem: "A dívida foi excluída com sucesso!" });
      }
    } catch (error) {
      res.status(500).json({ message: "Erro ao excluir a despesa!" });
    }
  }

  static async getExpenseStatement(req, res) {
    try {
      const { user } = req.headers;

      const expenses = await Expenses.find({ "user.title": user });

      const expenseStatement = expenses.reduce((acc, expense) => {
        const dueDate = new Date(expense.user.month.listMonth.dueDate);
        const month = dueDate.toLocaleDateString('default', { month: 'long' });
        const year = dueDate.getFullYear();

        const monthYear = `${month} ${year}`;

        if (!acc[monthYear]) {
          acc[monthYear] = {
            month: monthYear,
            total: 0,
            details: [],
          };
        }

        const value = parseFloat(expense.user.month.listMonth.value);

        acc[monthYear].total += value;
        acc[monthYear].details.push({
          expense: expense.user.month.listMonth.expense,
          value,
          dueDate
        });

        return acc;
      }, {});

      const result = Object.values(expenseStatement);

      res.status(200).json({ result });
    } catch (error) {
      res.status(500).json({ message: "Erro ao obter o extrato de dívidas!" });
    }
  }
};
