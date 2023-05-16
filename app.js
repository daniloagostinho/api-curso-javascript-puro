const express = require("express")
const cors = require("cors")

require("dotenv").config()

var app = express();
app.use(express.json())

app.use(cors())

const AuthRegisterUserRoutes = require("./routes/AuthRegisterUserRoutes") 
const LoginRoutes = require("./routes/LoginRoutes")
const incomesRoutes = require("./routes/incomesRoutes")

const expensesRoutes = require("./routes/ExpensesRoutes")

app.use(AuthRegisterUserRoutes)
app.use(LoginRoutes)
app.use(incomesRoutes)
app.use(expensesRoutes)

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Servidor rodando na porta: ${port}`)
})

require("./database/connection")