var express = require('express');
var router = express.Router();
var query = require('../../../db/msql');
var csrf = require('csurf');
var csrfProtection = csrf();
var fs = require('fs');
router.post('/assistants/ResearchGradeList',csrfProtection, function(req, res){
    if(req.session.profile){ 
                var input = {semester: req.body.semester, first_second: req.body.first_second};
		query.ShowResearchScoreComment(input, function(err,result){	
			if(err)
			{
				throw err;
				res.redirect('/');
			}
			if(!result)
				res.redirect('/');
			else{
				result = JSON.parse(result);
				var index = [];
				var groups = [];
				for(var i = 0; i<result.length; i++){
						var list = {
								professor_name: '',
								student:{
									id:'',
									name:'',
									score:null,
									comment:''
								}			
						}
						list.professor_name = result[i].tname;
						list.student.id = result[i].student_id;
						list.student.name = result[i].sname;
						list.student.score = parseInt(result[i].score);
						list.student.comment = result[i].comment;
						groups.push(list);
				}
				if(groups.length == result.length)
					res.send(groups);
						
			}			
		});	
		
    }
	else
        res.redirect('/');

});

module.exports = router;
