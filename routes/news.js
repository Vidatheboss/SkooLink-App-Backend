const express = require('express')
const connection = require('../config/connection')
const router = express.Router()

const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
require('dotenv').config()
let auth = require('../services/authentication')
let checkRole = require('../services/checkRole')

let query = ""

router.get('/get/:category', (req, res) =>{
    let category = req.params.category;
  
   if (category == "all"){
    query = "SELECT * FROM skoolink.news "
    connection.query(query, (err, results) =>{
        if(!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    });

   }else{
    query = "SELECT * FROM skoolink.news WHERE category='" + category + "'"
    connection.query(query, (err, results) =>{
        if(!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    });

   }
   
   
});


module.exports = router