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


module.exports = router