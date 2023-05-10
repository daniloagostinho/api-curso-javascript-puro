const Debts = require("../models/Debts");

module.exports = class DebtsController {
  static async registerDebts(req, res) {
    const title = req.body.user.month.title;
    const user = req.body.user.title;
    const date = req.body.user.date;

    const { debt, category, value, dueDate } =
      req.body.user.month.listMonth;

    if (!debt) {
      return res.status(422).json({ message: "A dívida é obrigatório!" });
    }

    if (!category) {
      return res.status(422).json({ message: "A categoria é obrigatório!" });
    }

    if (!value) {
      return res.status(422).json({ message: "O valor é obrigatório!" });
    }

    if (!dueDate) {
      return res
        .status(422)
        .json({ message: "A data de expiração é obrigatório!" });
    }

    const debts = new Debts({
      user: {
        title: user,
        date,
        month: {
          title,
          listMonth: {
            debt,
            category,
            value,
            dueDate
          },
        },
      },
    });

    try {
      await debts.save();
      res
        .status(201)
        .json({ message: "Cadastro de dívida realizado com sucesso!" });
    } catch (error) {
      res.status(500).json({ message: "Erro ao cadastrar dívida!" });
    }
  }

  static async listDebts(req, res) {
    
    Debts.find({}).then((list) => {
      const { month } = req.headers;
      const showMonth = month ? month : "";
      const { user } = req.headers;

      const newArray = list.map((el) => {
        return {
          user: {
            title: el.user.title,
            month: {
              title: el.user.month.title,
              listMonth: {
                _id: el._id.toString(),
                debt: el.user.month.listMonth.debt, 
                category: el.user.month.listMonth.category,
                value: el.user.month.listMonth.value,
                dueDate: el.user.month.listMonth.dueDate,
                actions: [
                  "https://raw.githubusercontent.com/daniloagostinho/curso-angular15-na-pratica/main/src/assets/images/edit.png",
                  "https://raw.githubusercontent.com/daniloagostinho/curso-angular15-na-pratica/main/src/assets/images/delete.png",
                ],
              },
            },
          },
        };
      });

      const result = showMonth
        ? newArray.filter(
            (item) =>
              user.includes(item.user.title) &&
              item.user.month.title.includes(month)
          )
        : list;


      res.status(200).json({ result });
    });
  }

  static async updateDebts(req, res) {
    try {
      const id = req.params.id;
      const user = await Debts.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ message: "Erro au atualizar dívida!" });
    }
  }

  static async deleteDebts(req, res) {
    try {
      const id = req.params.id;
      const deleteDebts = await Debts.findByIdAndDelete(id);

      if (deleteDebts) {
        res
          .status(200)
          .json({ messagem: "A dívida foi excluída com sucesso!" });
      }
    } catch (error) {
      res.status(500).json({ message: "Erro ao excluir a divída!" });
    }
  }

  static async getDebtStatement(req, res) {
    try {
      const { user } = req.headers;
  
      const debts = await Debts.find({ "user.title": user });

      const debtStatement = debts.reduce((acc, debt) => {
        const dueDate = new Date(debt.user.month.listMonth.dueDate);
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

        const value = parseFloat(debt.user.month.listMonth.value);

        acc[monthYear].total += value;
        acc[monthYear].details.push({
          debt: debt.user.month.listMonth.debt,
          value,
          dueDate
        });

        return acc;
      }, {});

      const result = Object.values(debtStatement);

      res.status(200).json({ result });
    } catch (error) {
      res.status(500).json({ message: "Erro ao obter o extrato de dívidas!" });
    }
  }
};
