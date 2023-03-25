const express = require('express')
const connection = require('../config/connection')
const router = express.Router()

const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
require('dotenv').config()
let auth = require('../services/authentication')
let checkRole = require('../services/checkRole')

let query = ""

router.post('/signup', (req, res) =>{
    let user = req.body
    query = "SELECT email, password, role, active FROM users WHERE email=?"
    connection.query(query, [user.email], (err, results) => {
        if(!err){
            if(results.length <= 0) {
                query = "INSERT INTO users (username, password, email, role, active) VALUES (?, ?, ?, 'teacher', false);"
                connection.query(query, [user.name, user.password, user.email], (err, results) =>{
                    if(!err) {
                        return res.status(200).json({
                            message: "Successfully Registered."
                        })
                    } else {
                        return res.status(500).json(err)
                    }
                })
            } else {
                return res.status(400).json({
                    message: "Email Already Exists."
                })
            }
        } else {
            return res.status(500).json(err)
        }
    })
})

router.post('/login', (req, res) =>{
    const user = req.body
    query = "SELECT email, password, role, active FROM users WHERE email=?"
    connection.query(query, [user.email], (err, results) =>{
        if(!err) {
            if(results.length <= 0 || results[0].password !== user.password) {
                return res.status(401).json({
                    message: "Incorrect Username or Password"
                })
            } else if(results[0].active === 0) {
                return res.status(401).json({
                    message: "Wait for Admin Approval"
                })
            } else if(results[0].password === user.password) {
                const response = {
                    email: results[0].email,
                    role: results[0].role
                }
                const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, {expiresIn: '8h'})
                res.status(200).json({
                    token: accessToken
                })
            } else {
        return res.status(400).json({
            message: "Something went wrong. Please try again later"
        })
            }
        } else {
            return res.status(400).json(err)
        }
    })
})

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

// router.post('/forgotPassword', (req, res) =>{
//     const user = req.body
//     query = "SELECT email, password FROM users WHERE email=?"
//     connection.query(query, [user.email], (err, results) =>{
//         if(!err) {
//             if(results.length <= 0) {
//                 return res.status(200).json({
//                     message: "Password sent successfully to your email."
//                 })
//             } else {
//                 let mailOptions = {
//                     from: process.env.EMAIL,
//                     to: results[0].email,
//                     subject: 'Password by Skoolink App System',
//                     html: '<p><b>Your Login details for Skoolink App</b><br><b>Email: </b>' + results[0].email + '<br><b>Password: </b>' + results[0].password + '<br><a href="http://localhost:4200">Click here to login</a></p>'
//                 }
//                 transporter.sendMail(mailOptions, function (error, info){
//                     if(error) {
//                         console.log(error)
//                     } else {
//                         console.log(`Email sent: ${info.response}`)
//                     }
//                 })
//                 return res.status(200).json({
//                     message: "Password sent successfully to your email."
//                 })
//             }
//         } else {
//             return res.status(500).json(err)
//         }
//     })
// })

router.get('/get', auth.authenticateToken, checkRole.checkRole, (req, res) =>{
    query = "SELECT id, username, email, active FROM users WHERE role='teacher'"
    connection.query(query, (err, results) =>{
        if(!err) {
            return res.status(200).json(results)
        } else {
            return res.status(500).json(err)
        }
    })
})

// router.patch('/update', auth.authenticateToken, checkRole.checkRole, (req, res) =>{
//     let user = req.body
//     query = "UPDATE user SET status=? WHERE id=?"
//     connection.query(query, [user.status, user.id], (err, results) =>{
//         if(!err) {
//             if(results.affectedRows === 0){
//                 return res.status(404).json({
//                     message: "User id does not exist"
//                 })
//             }
//             return res.status(200).json({
//                 message: "User updated Successfully"
//             })
//         } else {
//             return res.status(500).json(err)
//         }
//     })
// })

router.get('/checkToken', auth.authenticateToken, checkRole.checkRole, (req, res) =>{
    return res.status(200).json({
        message: "true"
    })
})

// router.post('/changePassword', auth.authenticateToken, (req, res) =>{
//     const user = req.body
//     const email = res.locals.email
//     console.log(email)
//     query = "SELECT * FROM users WHERE email=? AND password=?"
//     connection.query(query, [email, user.oldPassword], (err, results) =>{
//         if(!err) {
//             if(results.length <= 0) {
//                 return res.status(400).json({
//                     message: "Incorrect Old Password"
//                 })
//             } else if(results[0].password === user.oldPassword) {
//                 query = "UPDATE user SET password=? WHERE email=?"
//                 connection.query(query, [user.newPassword, email], (err, results) => {
//                     if(!err) {
//                         return res.status(200).json({
//                             message: "Password Updated Successfully"
//                         })
//                     } else {
//                         return res.status(500).json(err)
//                     }
//                 })
//             } else {
//                 return res.status(400).json({
//                     message: "Something went wrong. Please try again later"
//                 })
//             }
//         } else {
//             return res.status(500).json(err)
//         }
//     })
// })

module.exports = router