const express = require('express')
const connection = require('../config/connection')
const router = express.Router()

let query = ""

router.get('/messages/:id', (req, res) => {
   let id = req.params.id
  // console.log(id);
    query = "SELECT * FROM messages where sender_id=" + id

    connection.query(query, (err, results) =>{
        if(!err) {
            return res.status(200).json(results)
        } else {
            return res.status(500).json(err)
        }
    })
})

router.post('/compose', (req, res) =>{

    let message= req.body

    query = "INSERT INTO messages(sender_id, recipient_id, subject, message, date) VALUES(?, ?, ?, ?, CURDATE())"

    connection.query(query, [message.senderEmail, message.recipientEmail, message.subjectLine, message.description], (err, results) => {
        if(!err) {
            if(results.affectedRows === 0){
                return res.status(404).json({
                    message: "Table does not exist"
                })
            }
            return res.status(200).json({
                message: "Message inserted Successfully"
            })
        } else {
            return res.status(500).json(err)
        }
    })
})

module.exports = router