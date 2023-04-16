const express = require('express')
const connection = require('../config/connection')
const router = express.Router()

let query = ""

router.get('/messages/:id', (req, res) => {
   let id = req.params.id

    query = "SELECT * FROM messages where recipient_id=" + id

    connection.query(query, (err, results) =>{
        if(!err) {
            return res.status(200).json(results)
        } else {
            return res.status(500).json(err)
        }
    })
})
router.get('/inbox-filter/:id', (req, res) => {
    let id = req.params.id

     query = "SELECT * FROM messages where id=" + id
 
     connection.query(query, (err, results) =>{
         if(!err) {
             return res.status(200).json(results)
         } else {
             return res.status(500).json(err)
         }
     })
 })

router.get('/stat/:stid/:stat', (req, res) =>{
    let stat = req.params.stat;
    let stid=req.params.stid;
  
    query = "SELECT * FROM messages WHERE recipient_id=" + stid + " and stat=" + stat
    connection.query(query, (err, results) =>{
        if(!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    });
});
 router.post('/statupdate', (req, res) => {
    let id = req.body.id
    
   query = "UPDATE messages SET stat = 1 WHERE id = ?"
 
   connection.query(query, [id], (err, results) =>{
    if(!err) {
        return res.status(200).json({
            message: "Successfully Added."
        })
    } else {
        console.log("t")
    }
})
    
 })





router.post('/compose', (req, res) =>{

    let message= req.body

    query = "INSERT INTO messages(sender_id, recipient_id, subject, message, date, stat) VALUES(?, ?, ?, ?, CURDATE(),0)"

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