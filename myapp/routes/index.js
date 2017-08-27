var express = require('express');
var router = express.Router();
var User = require('../Models/Users');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');


/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('login');
});

router.get('/register', function(req, res, next) {
    res.render('register');
});

//register
router.post('/register', function(req, res, next) {
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    var newUser = new User({
        name: name,
        email:email,
        username: username,
        password: password
    });

    User.createUser(newUser, function(err, user){
        if(err) throw err;
        console.log(user);
    });

    res.redirect('/');

});

passport.use(new LocalStrategy(
    function(username, password, done)
    {
        User.getUserByUsername(username, function(err, user)
        {
            if(err) throw err;
            if(!user)
            {
                return done(null, false, {message: 'Unknown User'});
            }

            User.comparePassword(password, user.password, function(err, isMatch)
            {
                if(err) throw err;
                if(isMatch)
                {
                    return done(null, user);
                }
                else
                {
                    return done(null, false, {message: 'Invalid password'});
                }
            });
        });
    }));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});

router.post('/',
    passport.authenticate('local', {successRedirect:'/discussions/overview', failureRedirect:'/',failureFlash: false}),
    function(req, res) {
        res.redirect('/discussions/overview');
    });




module.exports = router;