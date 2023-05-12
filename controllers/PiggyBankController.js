const PiggyBank = require("../models/PiggyBank");

module.exports = class IncomesController {

    static async addToPiggyBank(req, res) {
        const { amount } = req.body;
        
        try {
            // Buscar o cofrinho ou criar um novo se não existir
            let piggyBank = await PiggyBank.findOne();
            if (!piggyBank) {
                piggyBank = new PiggyBank({ balance: 0 });
            }

            // Adicionar o valor ao cofrinho
            piggyBank.balance += amount;
            await piggyBank.save();

            res.status(200).json({ message: "Valor adicionado ao cofrinho com sucesso!" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro ao adicionar valor ao cofrinho!" });
        }
    }

    static async getPiggyBankBalance(req, res) {
        try {
            // Lógica para obter o saldo do cofrinho
            // Você pode adaptar a lógica de acordo com a estrutura do seu sistema e como o saldo do cofrinho é armazenado

            // Exemplo hipotético: supondo que você tenha um modelo chamado PiggyBank para representar o cofrinho
            const piggyBank = await PiggyBank.findOne();
            const balance = piggyBank.balance;

            res.status(200).json({ balance });
        } catch (error) {
            res.status(500).json({ message: "Erro ao obter o saldo do cofrinho!" });
        }
    }


};
