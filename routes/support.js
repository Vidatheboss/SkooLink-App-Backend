const express = require('express')
const connection = require('../config/connection')
const router = express.Router()

router.post('/', (req, res) => {
    let subject = req.body.subjectLine;
    let description = req.body.description;
    let userId = req.body.userId
    let status = 1;

   query = "INSERT INTO tickets (creator_id, subject, description, date, status) VALUES (?,?,?,sysdate(),?)"

    connection.query(query, [userId, subject, description, status], (err, results) => {
        if (!err) {
            return res.status(200).json({
                message: "Successfully Added."
            })
        } else {
            return res.status(500).json(err)
        }
    })


})

router.get('/tickets', (req, res) =>{
    let tickets = req.params.student;

    query = "SELECT tickets.creator_id, tickets.subject, tickets.description, tickets.date, users.email FROM skoolink.tickets " +
            "INNER JOIN users ON tickets.creator_id=users.id;"
    
 
    
    connection.query(query, (err, results) =>{
        if(!err) {
            return res.status(200).json(results)
        } else {
            return res.status(500).json(err)
        }
    })
})


module.exports = router