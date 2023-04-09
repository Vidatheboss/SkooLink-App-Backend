const express = require('express')
const connection = require('../config/connection')
const router = express.Router()

let query = ""

router.get('/', (req, res) => {
    query = "SELECT name FROM classes"

    connection.query(query, (err, results) =>{
        if(!err) {
            return res.status(200).json(results)
        } else {
            return res.status(500).json(err)
        }
    })
})

module.exports = router