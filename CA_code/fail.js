var express = require('express');
var router = express.Router();
var query = require('../../../../db/msql');
var getTeacherId = require('../../course/getTeacherId');
var csrf = require('csurf');
var csrfProtection = csrf();
//var Promise = require('promise');
var Q = require('q');

var TeacherId = getTeacherId.getTeacherId.teacherId;

function getInfo(student_id) {
    return new Promise(function(resolve, reject){
        query.ShowUserInfo(student_id, function(err2, studentInfo) {
            if (err2) {
                throw err2;
                res.redirect('/');
            }
            if (!studentInfo)
                res.redirect('/');
            studentInfo = JSON.parse(studentInfo);
            studentInfo ={
                student_id: studentInfo[0].student_id,
                sname: studentInfo[0].sname,
                program: studentInfo[0].program,
                graduate: studentInfo[0].graduate,
                graduate_submit: studentInfo[0].graduate_submit,
                email: studentInfo[0].email,
                failed:(studentInfo[0].failed == "failed") ? true : false
            }
        });
        resolve(studentInfo);
    });
}

router.get('/professors/students/list', TeacherId, function(req, res) {

    if (req.session.profile) {

        //var teacherId = req.body.id;
        var teacherId = res.locals.teacherId;
        query.ShowTeacherMentors(teacherId, function(err1, mentors) {
            if (err1) {
                throw err1;
                res.redirect('/');
            }
            if (!mentors)
                res.redirect('/');
            mentors = JSON.parse(mentors);
            var students = [];
            var promises = [];
            for (let i = 0; i < mentors.length; i++) {
                var student_id = mentors[i].student_id;
                promises.push(getInfo(student_id).then(function(studentInfo){
                    students.push(studentInfo);
                }));
                
            }
            
            Q.all(promises).then(function(){
                return res.send(students);
            })
        })
    }
    else
        res.redirect('/');

});

module.exports = router;
