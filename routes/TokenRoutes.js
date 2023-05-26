const router = require("express").Router();

const TokenController = require("../controllers/TokenController");

router.get("/validate/token", TokenController.validateToken);

module.exports = router;