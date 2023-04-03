const express = require('express')
const connection = require('../config/connection')
const router = express.Router()

let query = ""

router.post('/', (req, res) => {
    let studentId = req.body.id;
    let nurseId = req.body.nurseId;
    let description = req.body.description;

    query = "INSERT INTO student_medical_history (student_id, nurse_id, date, description) VALUES (?, ?, now(), ?)"
    
    connection.query(query, [studentId, nurseId, description], (err, results) =>{
        if(!err) {
            return res.status(200).json({
                message: "Successfully Added."
            })
        } else {
                    return res.status(500).json(err)
        }
    })
})

router.post('/edit', (req, res) => {
    let medicalId = req.body.id;
    let medicalInfo = req.body.description;

    query = "UPDATE student_medical_history SET description = ? WHERE id = ?"
    
    connection.query(query, [medicalInfo, medicalId], (err, results) =>{
        if(!err) {
            return res.status(200).json({
                message: "Successfully Updated."
            })
        } else {
                    return res.status(500).json(err)
        }
    })
})

router.get('/:student/', (req, res) => {
    let student = req.params.student
    query = "SELECT medical.id, nurses.name, medical.date, medical.description FROM student_medical_history medical INNER JOIN nurses ON medical.nurse_id = nurses.id WHERE medical.student_id = "+student

    connection.query(query, (err, results) =>{
        if(!err) {
            return res.status(200).json(results)
        } else {
            return res.status(500).json(err)
        }
    })
})

router.delete('/:medical_id', (req, res) => {
    let medicalId = req.params.medical_id

    query = "DELETE FROM student_medical_history WHERE id = ?";
    
    connection.query(query, [medicalId], (err, results) =>{
        if(!err) {
            return res.status(200).json({
                message: "Successfully Deleted."
            })
        } else {
            return res.status(500).json(err)
        }
    })

})

module.exports = router