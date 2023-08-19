
const express = require('express')
const usersRouter = require('./routers/users.route')
const agencyRouter = require('./routers/agencies.route')
const carsRouter = require('./routers/cars.route')
const transfersRouter = require('./routers/transfers.route')
const app = express()


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(usersRouter)
app.use(agencyRouter)
app.use(carsRouter)
app.use(transfersRouter)
//const bcrypt = require('bcrypt')
// app.post('/', async (req, res, next) => {
//     const hashedpassword = await bcrypt.hash(req.body.password, 10)
//     res.send(hashedpassword)
// })


app.listen('4000', () => {
    console.log('Listening on port 4000')
})