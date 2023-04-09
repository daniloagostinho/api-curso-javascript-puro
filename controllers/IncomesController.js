const Incomes = require("../models/incomes");

module.exports = class incomesController {
  static async registerincomes(req, res) {
    const { category, value, dateEntry } = req.body.user.month.listMonth;

    const title = req.body.user.month.title;
    const user = req.body.user.title;

    if (!category) {
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
            category,
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

  static async listincomes(req, res) {
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
                category: el.user.month.listMonth.category,
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

  static async updateincomes(req, res) {
    try {
      const id = req.params.id;
      const user = await incomes.findByIdAndUpdate(id, req.body, {
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
      const deleteincomes = await Incomes.findByIdAndDelete(id);

      if (deleteincomes) {
        res
          .status(200)
          .json({ messagem: "A receita foi excluída com sucesso!" });
      }
    } catch (error) {
      res.status(500).json({ message: "Erro ao excluir a receita!" });
    }
  }
};
