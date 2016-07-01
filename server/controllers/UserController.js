/**
 * Created by vishnu on 13/6/16.
 */

var HttpStatus = require('http-status');
var User = require("../models/User");
var Validation = require('./Validation');

exports.save = function (req, res) {
    console.log('Saving user');

    User.findOne({email:new RegExp('^'+req.body.email+'$','i')}, function(err, user) {
        if (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: 'unexpected error accessing data'});
            return;
        }
        if(user == null){
            var newUser = new User;
            newUser.name = req.body.name;
            newUser.email = req.body.email;
            newUser.password = req.body.password;
            newUser.role = 'NORMAL';

            newUser.save(function(saveErr , savedUser){
                if (saveErr) {
                    res.status(HttpStatus.BAD_REQUEST).json(Validation.validatingErrors(saveErr));
                    return;
                }
                res.status(HttpStatus.OK).json(savedUser);
            });
            return;
        }
        res.status(HttpStatus.BAD_REQUEST).json({email: 'Email already exists'});
    });
};

exports.list = function(req,res){

    console.log('User list invoked...');

    User.find({}, {password: 0}).exec(function (err, users) {
        if (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: 'unexpected error accessing data'});
            return;
        }
        res.status(HttpStatus.OK).json(users);
    });
};

exports.fetch = function(req, res){
    console.log("Getting User with id : " + req.params.id);

    User.findById(req.params.id, {password: 0}).exec(function (err, user) {
        if (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: 'unexpected error accessing data'});
            return;
        }
        if (user == null) {
            res.status(HttpStatus.NOT_FOUND).json({error: 'User not found'});
            return;
        }
        res.status(HttpStatus.OK).json(user);
    });
};

exports.remove = function(req,res){             // Removes an User matching the ID.

    User.findByIdAndRemove(req.params.id, function (err, user) {
        if (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: 'unexpected error accessing data'});
            return;
        }
        if (user == null) {
            res.status(HttpStatus.NOT_FOUND).json({error: 'user not found'});
            return;
        }
        res.status(HttpStatus.OK).json({success:'User has been deleted'});
    });
};


function saveSME () {
    console.log('SME saved');
    User.findOne({email: 'vishnu@gmail.com'}, function (err, user) {
        if (err) {
            console.log(err)
            return;
        }
        if (user == null) {
            var newUser = new User;
            newUser.name = 'vishnu';
            newUser.email = 'vishnu@gmail.com';
            newUser.password = 'welcome123';
            newUser.role = 'SME';

            newUser.save(function (saveErr, savedUser) {
                if (saveErr) {
                    console.log(Validation.validatingErrors(saveErr));
                    return;
                }

            });
        }

    });
}

saveSME ();