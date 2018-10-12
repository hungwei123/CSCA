var express = require('express');
var router = express.Router();
var query = require('../../db/msql');
//var getTeacherId = require('../../course/getTeacherId');


//var TeacherId = getTeacherId.getTeacherId.teacherId;
router.get('/testAPI', function(req, res){

    if(req.session.profile){
    
        //var teacherId = res.locals.teacherId;
        
        query.ShowResearchScoreComment({semester: '106-2', first_second: 2}, function(err, result){
            if(err){
                throw err;
                res.redirect('/');
            }
            if(!result)
                res.redirect('/');
            else{
                result = JSON.parse(result);
                console.log(result);
                res.send(result);
            }
        });
    }
    else
        res.redirect('/');

});

module.exports = router;
