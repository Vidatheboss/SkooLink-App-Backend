const express = require('express')
const connection = require('../config/connection')
const router = express.Router()

const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
require('dotenv').config()
let auth = require('../services/authentication')
let checkRole = require('../services/checkRole')

let query = ""

router.get('/get', (req, res) =>{
    query = "SELECT * FROM news"
    connection.query(query, (err, results) =>{
        if(!err) {
            return res.status(200).json(results)
        } else {
            return res.status(500).json(err)
        }
    })
})

// router.post('/', (req, res) =>{
// //     query = "INSERT INTO news (category, description, date, user_id) VALUES (?, ?, ?, ?);"
// //     connection.query(query, ["Important", "We will not have class during next week! Have a break!", "2023-03-22", 4], (err, results) =>{
// //         if(!err) {
// //             return res.status(200).json({
// //                 message: "Successfully Registered."
// //             })
// //         } else {
// //             return res.status(500).json(err)
// //         }
// //     })
// // })


module.exports = router