const Incomes = require("../models/Incomes");

module.exports = class IncomesController {
  static async registerIncomes(req, res) {
    const { income, value, dateEntry } = req.body.user.month.listMonth;

    const title = req.body.user.month.title;
    const user = req.body.user.title;

    if (!income) {
      return res
        .status(422)
        .json({ message: "O tipo de receita é obrigatório!" });
    }

    if (!value) {
      return res.status(422).json({ message: "O valor obrigatório!" });
    }

    if (!dateEntry) {
      return res
        .status(422)
        .json({ message: "A data de entrada é obrigatório!" });
    }

    const incomes = new Incomes({
      user: {
        title: user,
        month: {
          title,
          listMonth: {
            income,
            value,
            dateEntry,
          },
        },
      },
    });

    try {
      await incomes.save();
      res
        .status(201)
        .json({ message: "Cadastro da receita realizado com sucesso!" });
    } catch (error) {
      res.status(500).json({ message: "Erro ao cadastrar a receita!" });
    }
  }

  static async listIncomes(req, res) {
    Incomes.find({}).then((list) => {
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
                income: el.user.month.listMonth.income,
                value: el.user.month.listMonth.value,
                dateEntry: el.user.month.listMonth.dateEntry,
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

  static async updateIncomes(req, res) {
    try {
      const id = req.params.id;
      const user = await Incomes.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ message: "Erro au atualizar receita!" });
    }
  }

  static async deleteIncome(req, res) {
    try {
      const id = req.params.id;
      const deleteIncomes = await Incomes.findByIdAndDelete(id);

      if (deleteIncomes) {
        res
          .status(200)
          .json({ messagem: "A receita foi excluída com sucesso!" });
      }
    } catch (error) {
      res.status(500).json({ message: "Erro ao excluir a receita!" });
    }
  }

  static async getIncomeStatement(req, res) {
    try {
      const incomes = await Incomes.find({});

      const incomeStatement = incomes.reduce((acc, income) => {
        const dateEntry = new Date(income.user.month.listMonth.dateEntry);
        const month = dateEntry.toLocaleDateString('default', { month: 'long' });
        const year = dateEntry.getFullYear();

        const monthYear = `${month} ${year}`;

        if (!acc[monthYear]) {
          acc[monthYear] = {
            month: monthYear,
            total: 0,
            details: [],
          };
        }

        const value = parseFloat(income.user.month.listMonth.value);

        acc[monthYear].total += value;
        acc[monthYear].details.push({
          income: income.user.month.listMonth.income,
          value,
          dateEntry
        });

        return acc;
      }, {});

      const result = Object.values(incomeStatement);

      res.status(200).json({ result });
    } catch (error) {
      res.status(500).json({ message: "Erro ao obter o extrato de receitas!" });
    }
  }
};
