var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,
            session:false,
        },
        function(req, email, password, done) {
            var name = req.body.name;
            var lastname = req.body.lastname;
            var age = req.body.age;
            var city = req.body.city;
            var role = req.body.role;
            console.log(role);

            process.nextTick(function() {
                User.findOne({ 'local.email':  email }, function(err, user) {
                    if (err)
                        return done(err);
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'That email is already in use.'));
                    } else {
                        var newUser = new User();
                        newUser.local.email = email;
                        newUser.local.role = role;
                        newUser.local.name = name;
                        newUser.local.city = city;
                        newUser.local.lastname = lastname;
                        newUser.local.age = age;
                        newUser.local.password = newUser.generateHash(password);
                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            });
        }));










    passport.use('local-login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            //roleField: 'role',
            passReqToCallback: true,
        },
        function(req, email, password, done) {

            User.findOne({ 'local.email':  email }, function(err, user) {

                if (err)
                    return done(err);
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.'));
                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Wrong password.'));
                return done(null, user);
            });
        }));
};