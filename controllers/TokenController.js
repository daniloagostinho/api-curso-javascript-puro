const jwt = require('jsonwebtoken');

module.exports = class TokenController {
    static async validateToken(req, res) {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            return res
                .status(401)
                .json({ message: "Acesso negado! Verifique se o token foi passado!" });
        }

        try {
            const secret = process.env.SECRET;
            jwt.verify(token, secret);
            res.status(200).json({ message: 'Token válido', isValidToken: true });
        } catch (error) {
            res.status(500).json({ message: 'Token inválido', isValidToken: false });
        }
    }

};