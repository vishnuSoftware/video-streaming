/**
 * Created by vishnu on 13/6/16.
 */
var HttpStatus = require('http-status');
var User = require("../models/User");
var Validation = require('./Validation');
var trim = require('trimmer');

exports.authenticate=function(req,res){     // Authenticates the user with credentials.

    User.findOne({email:new RegExp('^'+req.body.email+'$','i'),password:trimming(req.body.password)},{password:0},function(err,user) {
        if (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: 'unexpected error accessing data'});
            return;
        }
        if (user == null) {
            res.status(HttpStatus.BAD_REQUEST).json({error: 'Sorry! Email id and password does not match'});
            return;
        }
        req.session.loggedInUser = user;

        res.status(HttpStatus.OK).json(user);

    });
};

exports.getLoggedInUser = function(req,res){        // Get Logged in user details.

    if (req.session.loggedInUser) {
        User.findById(req.session.loggedInUser._id, {password: 0}).exec(function (err, user) {
            if (err) {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: 'unexpected error accessing data'});
                return;
            }
            if (user == null) {
                res.status(HttpStatus.NOT_FOUND).json({error: 'User not found'});
                return;
            }
            res.status(HttpStatus.OK).json(req.session.loggedInUser);
        });
    }
    else {
        res.status(HttpStatus.BAD_REQUEST).json({error: 'Session invalid'});
    }
};


exports.logOut = function (req, res) {      // Removes the user details from session.
        req.session.loggedInUser = null;
        res.status(HttpStatus.OK).json({success: 'Successfully logged out'});
};

var trimming = function (value) {
    if (value != undefined)
        return trim(value);
    return value;
};
