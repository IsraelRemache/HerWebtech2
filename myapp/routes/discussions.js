var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Discussion = require('../Models/Discussions');
var Question = require('../Models/Questions');
var Answer = require('../Models/Answers');

router.get('/overview', function(req, res){

    Discussion.find( function(err, docs) {
        res.render('index', {data: docs});
    });


});

router.get('/create', function(req, res){

    res.render('create');

});

router.post('/create', function (req, res) {
    // if (!req.body) return res.sendStatus(400)

    var post = new Discussion({title: req.body.title , message: req.body.message, userId: 1});

    //save model to MongoDB
    post.save(function (err,room) {
        if (err) {
            return err;
        }
        else {
            console.log("A new discussion is opened with id: " + room.id);
            res.redirect('/discussions/' + room.id);
        }
    });
});

router.get('/:id', function(req, res){
    //check all discussions
    Discussion.count({ '_id': req.params.id }, function(err, count){
        if(count == 1)
        {
            Discussion.find({ '_id': req.params.id }, function(err, docs){

                Question.find({ 'discussionId': docs[0].id }, function(err, docs2){


                    var answers = [];

                    res.render('discussions', {"id": docs[0].id, "title": docs[0].title, "message": docs[0].message, "userId": docs[0].userId, "question": docs2});
                });

            });
        }
        else
        {
            res.render("error");
        }
    });
});

router.post('/:id', function (req, res) {
    if(req.body.del != null){

        Question.remove({ _id: req.body.del }, function(err) {
            if (!err) {
                res.redirect("/discussions/"+req.params.id);
            }
        });

    }else{

        if(req.body.answer != null)
        {
            var answer = new Answer({answer: req.body.answer , questionId: req.body.questionId , discussionId: req.params.id});

            answer.save(function (err,room) {
                if (err) {
                    return err;
                }
                else {
                    console.log("A new answer is opened with id: " + room.id);
                    res.redirect(req.params.id);
                }
            });
        }
        else
        {
            var question = new Question({question: req.body.question , discussionId: req.params.id});

            question.save(function (err,room) {
                if (err) {
                    return err;
                }
                else {
                    console.log("A new question is opened with id: " + room.id);
                    res.redirect(req.params.id);
                }
            });
        }


    }



});



module.exports = router;
