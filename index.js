const express = require('express')
const cors = require('cors')
const connection = require('./config/connection')
const userRoute = require('./routes/users')
const studentsRoute = require('./routes/students')
const nursesRoute = require('./routes/nurses')
const coursesRoute = require('./routes/courses')
const newsRoute = require('./routes/news')
const inboxRoute = require('./routes/inbox')
const medInfoRoute = require('./routes/medical-info')

const app = express()

app.use(cors())
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())
app.use('/users', userRoute)
app.use('/students', studentsRoute)
app.use('/nurses', nursesRoute)
app.use('/news', newsRoute)
app.use('/courses', coursesRoute)
app.use('/inbox',inboxRoute)
app.use('/medical-info',medInfoRoute)

module.exports = app