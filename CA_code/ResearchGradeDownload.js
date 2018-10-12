var express = require('express');
var router = express.Router();
var query = require('../../../db/msql');
var csrf = require('csurf');
var csrfProtection = csrf();
var fs = require('fs');
var Json2csvParser = require('json2csv').Parser;
router.post('/assistants/ResearchGradeDownload',csrfProtection, function(req, res){

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
		var fields = ['tname','student_id','sname','score','comment'];
		var json2csvParser = new Json2csvParser({fields});
		var csv = json2csvParser.parse(JSON.parse(result));

		var ExcelBuffer = Buffer.concat([
   			 new Buffer('\xEF\xBB\xBF', 'binary'),
			 new Buffer(csv)
		]);
           fs.writeFile('project_score.csv',ExcelBuffer, function(err){
            if (err) 
                console.log(err);
              });
                 setTimeout(function(){
		       res.download('./project_score.csv');

		},500);	
		
					
		});	
		
    }
	else
        res.redirect('/');

});

module.exports = router;
