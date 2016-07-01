/**
 * Created by vishnu on 14/6/16.
 */

var HttpStatus = require('http-status');
var fs = require('fs');

exports.fileUpload1 = function (req, res) {

    console.log('==================');
    console.log(req.files.file.name);
    console.log('==================');

    fs.readFile(req.files.file.path, function (err, data) {
        if (err) throw err;
        fs.writeFile('./videos/' + req.files.file.name, data, function (err) {
            if (err) throw err;
            if (fs.existsSync(req.files.file.path)) {
                fs.unlinkSync(req.files.file.path);
            }
            console.log('complete');

        });
        res.status(HttpStatus.OK).json({message: 'ok'});
    });

};

exports.fileLocation =function (req , res) {
    var walk = require('walk');
    var files = [];
    var record={};

    var walker = walk.walk('./videos', {followLinks: false});

    walker.on('file', function (root, stat, next) {
        record={};
        record.fileName =stat.name;
        record.path = root + '/' + stat.name;
        files.push(record);
        next();
    });

    walker.on('end', function () {
        console.log(files);
        res.status(HttpStatus.OK).json(files);
    });
};


exports.removeFile  = function(req ,res){

    if (fs.existsSync(req.body.path)) {
        fs.unlinkSync(req.body.path);
        res.status(HttpStatus.OK).json({message:'successfully removed'});
        return;
    }
    res.status(HttpStatus.NOT_FOUND).json({error:'file not found'});
};


//var  path = require('path');
//
//function getDirectories(srcpath) {
//    return fs.readdirSync(srcpath).filter(function(file) {
//        return fs.statSync(path.join(srcpath, file)).isDirectory();
//    });
//}
//
//console.log(getDirectories('./public'))

