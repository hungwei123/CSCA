var express = require('express');
var router = express.Router();
var query = require('../../../../db/msql');
var getTeacherId = require('../../course/getTeacherId');


var TeacherId = getTeacherId.getTeacherId.teacherId;
router.get('/professors/students/list',TeacherId, function(req, res){

    if(req.session.profile){
    
        var teacherId = res.locals.teacherId;
        
        query.ShowTeacherMentors(teacherId, function(err, result){
            if(err){
                throw err;
                res.redirect('/');
            }
            if(!result)
                res.redirect('/');
            else{
                var info = [];
                result = JSON.parse(result);
                
                for(var i=0;i<result.length;i++){
                    query.ShowUserInfo(result[i].student_id, function(err,profile){
                        if(err){
                            throw err;
                            return;
                        }
                        if(!profile){
                            return;
                        }
                        else{
                            profile = JSON.parse(profile);
                            profile ={
                                student_id: profile[0].student_id,
                                sname: profile[0].sname,
                                program: profile[0].program,
                                graduate: profile[0].graduate,
                                graduate_submit: profile[0].graduate_submit,
                                email: profile[0].email,
                                failed:(profile[0].failed =="failed")?true:false
                            }
                            info.push(profile);
                        }
                        if(info.length == result.length)
                            res.send(info);
                    });
    
                }
            }
        });
    }
    else
        res.redirect('/');

});

module.exports = router;
