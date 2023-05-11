const Incomes = require("../models/Incomes");

module.exports = class IncomesController {
  static async registerIncomes(req, res) {
    const { income, value, dueDate, paymentMethod } = req.body.user.month.listMonth;

    const title = req.body.user.month.title;
    const user = req.body.user.title;
    const year = req.body.user.month.year;

    if (!income) {
      return res
        .status(422)
        .json({ message: "O tipo de receita é obrigatório!" });
    }

    if (!value) {
      return res.status(422).json({ message: "O valor obrigatório!" });
    }

    if (!dueDate) {
      return res
        .status(422)
        .json({ message: "A data de entrada é obrigatório!" });
    }

    if (!paymentMethod) {
      return res
        .status(422)
        .json({ message: "O método de pagamento é obrigatório!" });
    }


    const incomes = new Incomes({
      user: {
        title: user,
        month: {
          title,
          year,
          listMonth: {
            income,
            value,
            dueDate,
            paymentMethod
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
    const { month, year } = req.headers;

    console.log(month, year)
    const user = req.headers.user;
    try {
      let list = await Incomes.find({ "user.month.year": year, "user.month.title": month, "user.title": user });
      const result = list.map((el) => {
        return {
          user: {
            title: el.user.title,
            month: {
              title: el.user.month.title,
              year: el.user.month.year,
              listMonth: {
                _id: el._id.toString(),
                income: el.user.month.listMonth.income,
                value: el.user.month.listMonth.value,
                dueDate: el.user.month.listMonth.dueDate,
                paymentMethod: el.user.month.listMonth.paymentMethod,
                actions: [
                  "https://raw.githubusercontent.com/daniloagostinho/curso-javascript/main/src/assets/images/edit.png",
                  "https://raw.githubusercontent.com/daniloagostinho/curso-javascript/main/src/assets/images/delete.png"
                ],
              },
            },
          },
        };
      });
  
      res.status(200).json({ result });
    } catch (error) {
      res.status(500).json({ message: "Erro ao listar as receitas!" });
    }
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
      const { user } = req.headers;
  
      const incomes = await Incomes.find({ "user.title": user });
  
      const incomeStatement = incomes.reduce((acc, income) => {
        const dueDate = new Date(income.user.month.listMonth.dueDate);
        const month = dueDate.toLocaleDateString('default', { month: 'long' });
        const year = dueDate.getFullYear();
  
        const monthYear = `${month} ${year}`;
  
        if (!acc[monthYear]) {
          acc[monthYear] = {
            month: monthYear,
            total: 0,
            details: []
          };
        }
  
        const value = parseFloat(income.user.month.listMonth.value);
  
        acc[monthYear].total += value;
        acc[monthYear].details.push({
          income: income.user.month.listMonth.income,
          value,
          dueDate
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
