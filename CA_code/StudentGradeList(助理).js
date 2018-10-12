var express = require('express');
var router = express.Router();
var query = require('../../../db/msql');
var csrf = require('csurf');
var csrfProtection = csrf();

//router.get('/StudentGradeList', function(req, res){
router.post('/StudentGradeList',csrfProtection, function(req, res){
	if(req.session.profile){
	 	var input = req.body;
	 	query.ShowSemesterScore(input, function(err, result){
	 		if(err){
				throw err;
				res.redirect('/');
			}
			if(!result)
				res.redirect('/');
			else{
				result = JSON.parse(result);
				var list = [];
				for(var i = 0; i < result.length; i++){
					var grade = {
						semester: result[i].semester,
						failed: result[i].failed == 'false' ? false : true,
						avg : parseInt(result[i].avg),
						credit : parseInt(result[i].credit),
						score: []
					};
					for(var j = 0; j < result[i].score.length; j++){
						var scoreObj = {
							cn: result[i].score[j].cn,
							en: result[i].score[j].en,
							score: parseInt(result[i].score[j].score),
							pass: result[i].score[j].pass == '通過' ? true : false
						}
						grade.score.push(scoreObj);
					}
					if(grade.score.length == result[i].score.length)
						list.push(grade);
				}
				if(list.length == result.length)
					res.send(list);
			}
	 	});
	}
	else
        res.redirect('/');
});

module.exports = router;
