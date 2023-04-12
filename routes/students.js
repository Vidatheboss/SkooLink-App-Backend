const express = require('express')
const connection = require('../config/connection')
const router = express.Router()

let query = ""

router.get('/profile/:student', (req, res) => {
    let student = req.params.student
    query = "SELECT name FROM students WHERE id="+student

    connection.query(query, (err, results) =>{
        if(!err) {
            return res.status(200).json(results)
        } else {
            return res.status(500).json(err)
        }
    })
})

router.get('/profile/:student/grades', (req, res) => {
    let student = req.params.student
    query = "SELECT grades.id as ID, classes.name AS course, grades.grade AS grade FROM grades INNER JOIN classes ON grades.class_id = classes.id WHERE grades.student_id = "+student

    connection.query(query, (err, results) =>{
        if(!err) {
            return res.status(200).json(results)
        } else {
            return res.status(500).json(err)
        }
    })
})

router.post('/grades/', (req, res) => {
    let course = req.body.course
    query = "SELECT id FROM classes WHERE name = ?"
    connection.query(query, [course], (err, results) =>{
        if(!err && results.length == 1) {
            course = Object.values(JSON.parse(JSON.stringify(results)));
            let student = req.body.student
            let grade = req.body.grade
            query = "INSERT INTO grades (student_id, teacher_id, class_id, date, grade) VALUES (?,?,?,?,?)"

            connection.query(query, [student, 1, course[0].id, new Date().toISOString().slice(0,10).replace(/-/g,""), grade], (err, results) =>{
                if(!err) {
                    return res.status(200).json({
                        message: "Successfully Added."
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

router.delete('/grades/:id', (req, res) => {
    let id = req.params.id;

    query = "DELETE FROM grades WHERE id = ?";
    
    connection.query(query, [id], (err, results) =>{
        if(!err) {
            return res.status(200).json({
                message: "Successfully Deleted."
            })
        } else {
            return res.status(500).json(err)
        }
    })

})

router.post('/grades/edit/', (req, res) => {
    let gradeId = req.body.id;
    let course = req.body.course;
    let grade = req.body.grade;
    
    query = "SELECT id FROM classes WHERE name = ?"
    
    connection.query(query, [course], (err, results) =>{
        if(!err && results.length == 1) {
            course = Object.values(JSON.parse(JSON.stringify(results)));
            console.log(course);
            query = "UPDATE grades SET class_id = ?, grade = ? WHERE id = ?"

            connection.query(query, [course[0].id, grade, gradeId], (err, results) =>{
                if(!err) {
                    return res.status(200).json({
                        message: "Successfully Updated."
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

router.get('/', (req, res) =>{
    query = "SELECT * FROM students"
    connection.query(query, (err, results) =>{
        if(!err) {
            return res.status(200).json(results)
        } else {
            return res.status(500).json(err)
        }
    })
})

router.get('/:student', (req, res) =>{
    let student = req.params.student;

    query = "SELECT * FROM students WHERE id = '"+student+"' OR name LIKE '%"+student+"%'";
    
    connection.query(query, (err, results) =>{
        if(!err) {
            return res.status(200).json(results)
        } else {
            return res.status(500).json(err)
        }
    })
})

module.exports = router