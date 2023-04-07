const express = require('express')
const connection = require('../config/connection')
const router = express.Router()

let query = ""

router.get('/:nurse', (req, res) => {
    let nurse = req.params.nurse
    query = "SELECT id, name FROM nurses WHERE user_id = "+nurse
    
    connection.query(query, (err, results) =>{
        if(!err) {
            return res.status(200).json(results)
        } else {
            return res.status(500).json(err)
        }
    })
})

module.exports = router