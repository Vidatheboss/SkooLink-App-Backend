const express = require('express')
const connection = require('../config/connection')
const router = express.Router()

const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
require('dotenv').config()
let auth = require('../services/authentication')
let checkRole = require('../services/checkRole')

let query = ""

router.post('/login', (req, res) =>{
    const user = req.body
    query = "SELECT id, email, password, role, active FROM users WHERE email=?"
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
                switch (results[0].role) {
                    case "1":
                        query = "SELECT name FROM students WHERE user_id = ?;"
                        break;
                    case "2":
                        query = "SELECT name FROM teachers WHERE user_id = ?;"
                        break;
                    case "3":
                        query = "SELECT name FROM nurses WHERE user_id = ?;"
                        break;
                    case "4":
                        query = "SELECT name FROM parents WHERE user_id = ?;"
                        break;
                    case "5":
                        query = "SELECT name FROM admins WHERE user_id = ?;"
                        break;
                }

                let userEmail = results[0].email;
                let userRole = results[0].role;
                let userId = results[0].id;
                connection.query(query, [userId], (err, results) => {
                    if (!err) {
                        const response = {
                            email: userEmail,
                            role: userRole
                        }

                        const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, {expiresIn: '8h'})
                        res.status(200).json({
                            token: accessToken,
                            id: userId,
                            role: userRole,
                            fullName: results[0].name
                        })
                    } else {
                        return res.status(401).json({
                            message: "Incorrect Username or Password"
                        })
                    }
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

router.get('/getUser/:id', (req, res) =>{

    let id = req.params.id;

    query = "SELECT id, username, email, active FROM users WHERE id=?"

    connection.query(query, [id], (err, results) =>{
        if(!err) {
            return res.status(200).json(results)
        } else {
            return res.status(500).json(err)
        }
    })
})



router.get('/checkToken', auth.authenticateToken, checkRole.checkRole, (req, res) =>{
    return res.status(200).json({
        message: "true"
    })
})

router.get('/getUsers', auth.authenticateToken, checkRole.checkRole, (req, res) =>{
    query = "SELECT u.id, u.username, u.email, u.role, r.name FROM users u INNER JOIN roles r ON u.role = r.id;"
    connection.query(query, (err, results) =>{
        if(!err) {
            return res.status(200).json(results)
        } else {
            return res.status(500).json(err)
        }
    })
})

router.get('/getOneUser/:id/:role', (req, res) =>{
    let id = req.params.id;
    let role = req.params.role;

    switch (role) {
        case "1":
            query = "SELECT u.id, u.username, u.email, u.role, r.name, s.name as fullName FROM users u INNER JOIN roles r ON u.role = r.id INNER JOIN students s ON s.user_id = u.id WHERE u.id = ?;"
            break;
        case "2":
            query = "SELECT u.id, u.username, u.email, u.role, r.name, t.name as fullName FROM users u INNER JOIN roles r ON u.role = r.id INNER JOIN teachers t ON t.user_id = u.id WHERE u.id = ?;"
            break;
        case "3":
            query = "SELECT u.id, u.username, u.email, u.role, r.name, n.name as fullName FROM users u INNER JOIN roles r ON u.role = r.id INNER JOIN nurses n ON n.user_id = u.id WHERE u.id = ?;"
            break;
        case "4":
            query = "SELECT u.id, u.username, u.email, u.role, r.name, p.name as fullName FROM users u INNER JOIN roles r ON u.role = r.id INNER JOIN parents p ON p.user_id = u.id WHERE u.id = ?;"
            break;
        case "5":
            query = "SELECT u.id, u.username, u.email, u.role, r.name, a.name as fullName FROM users u INNER JOIN roles r ON u.role = r.id INNER JOIN admins a ON a.user_id = u.id WHERE u.id = ?;"
            break;
    }
    connection.query(query, [id], (err, results) =>{
        if(!err) {
            return res.status(200).json(results)
        } else {
            return res.status(500).json(err)
        }
    })
})

router.post('/create', (req, res) =>{
    let user = req.body
    query = "SELECT email, password, role, active FROM users WHERE email = ?"
    connection.query(query, [user.email], (err, results) => {
        if(!err){
            if(results.length <= 0) {
                query = "INSERT INTO users (username, password, email, role, active) VALUES (?, ?, ?, ?, true);"
                connection.query(query, [user.username, user.password, user.email, user.role], (err, results) =>{
                    if(!err) {
                        switch (user.role) {
                            case "1":
                                query = "INSERT INTO students (user_id, name) VALUES ((SELECT MAX(id) FROM users), ?);"
                                break;
                            case "2":
                                query = "INSERT INTO teachers (user_id, name) VALUES ((SELECT MAX(id) FROM users), ?);"
                                break;
                            case "3":
                                query = "INSERT INTO nurses (user_id, name) VALUES ((SELECT MAX(id) FROM users), ?);"
                                break;
                            case "4":
                                query = "INSERT INTO parents (user_id, name) VALUES ((SELECT MAX(id) FROM users), ?);"
                                break;
                            case "5":
                                query = "INSERT INTO admins (user_id, name) VALUES ((SELECT MAX(id) FROM users), ?);"
                                break;
                        }

                        connection.query(query, [user.fullName], (err, result) =>{
                            if (!err) {
                                return res.status(200).json({
                                    message: "User Successfully Registered."
                                })
                            } else {
                                return res.status(500).json(err)
                            }
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

router.put('/edit/:id/:role', (req, res) => {
    let user = req.body
    let id = req.params.id;
    let role = req.params.role;

    query = "UPDATE users SET username = ?, password = ? WHERE id = ?"
    connection.query(query, [user.username, user.password, id], (err) => {
        if (!err) {
            switch (role) {
                case "1":
                    query = "UPDATE students SET name = ? WHERE user_id = ?"
                    break;
                case "2":
                    query = "UPDATE teachers SET name = ? WHERE user_id = ?"
                    break;
                case "3":
                    query = "UPDATE nurses SET name = ? WHERE user_id = ?"
                    break;
                case "4":
                    query = "UPDATE parents SET name = ? WHERE user_id = ?"
                    break;
                case "5":
                    query = "UPDATE admins SET name = ? WHERE user_id = ?"
                    break;
            }
            connection.query(query, [user.fullName, id], (err) => {
                if(!err) {
                    return res.status(200).json({
                        message: "Record Successfully Updated."
                    })
                } else {
                    return res.status(500).json(err)
                }
            })
        } else {
            return res.status(500).json(err)
        }
    })
})

router.delete('/delete/:id/:role', (req, res) => {
    let id = req.params.id;
    let role = req.params.role;

    switch (role) {
        case "1":
            query = "DELETE FROM students WHERE user_id = ?"
            break;
        case "2":
            query = "DELETE FROM teachers WHERE user_id = ?"
            break;
        case "3":
            query = "DELETE FROM nurses WHERE user_id = ?"
            break;
        case "4":
            query = "DELETE FROM parents WHERE user_id = ?"
            break;
        case "5":
            query = "DELETE FROM admins WHERE user_id = ?"
            break;
    }

    connection.query(query, [id], (err, results) => {
        if(!err) {
            query = "DELETE FROM users WHERE id = ?"
            connection.query(query, [id], (err, results) => {
                if (!err) {
                    return res.status(200).json({
                        message: "Record Successfully Deleted."
                    })
                } else {
                    return res.status(500).json(err)
                }
            })
        } else {
            return res.status(500).json(err)
        }
    })
})

module.exports = router