var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Discussion = require('../Models/Discussions');

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


module.exports = router;
