/**
 * Created by atribs on 13/6/16.
 */

var mongoose = require('mongoose');
Schema = mongoose.Schema;

var uniqueValidator = require('mongoose-unique-validator');


var UserSchema = new mongoose.Schema({
    name:{type:String, required:true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role:{type:String,enum:['SME','NORMAL']}
});

var User = mongoose.model('User', UserSchema);
module.exports = User;

UserSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });