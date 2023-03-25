const express = require('express')
const cors = require('cors')
const connection = require('./config/connection')
const userRoute = require('./routes/users')
const studentRoute = require('./routes/student')
const indexRoute = require('./routes')
const newsRoute = require('./routes/news')
const inboxRoute = require('./routes/inbox')

const app = express()

app.use(cors())
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())
app.use('/users', userRoute)
app.use('/students', studentRoute)
app.use('/news', newsRoute)
app.use('/', indexRoute)
app.use('/inbox',inboxRoute)

module.exports = app