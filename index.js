const express = require('express')
const cors = require('cors')
const connection = require('./config/connection')
const userRoute = require('./routes/user')
const studentRoute = require('./routes/student')
const indexRoute = require('./routes')
const newsRoute = require('./routes/news')

const app = express()

app.use(cors())
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())
app.use('/user', userRoute)
app.use('/students', studentRoute)
app.use('/news', newsRoute)
app.use('/', indexRoute)

module.exports = app