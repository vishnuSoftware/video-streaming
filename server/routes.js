/**
 * Created by vishnu on 13/6/16.
 */
var HttpStatus = require('http-status');
var userController = require('./controllers/UserController.js');
var loginController = require('./controllers/LoginController.js')
var FileUploadController = require('./controllers/FileUploadController.js')
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

module.exports = function (app) {

    app.all('/', function (req, res) {
        res.sendFile('index.html', {root: './public/pages/'});
    });

    function loginAuth(req, res, next) {
        if (!req.session.loggedInUser) {
            res.status(HttpStatus.UNAUTHORIZED).json({unAuthMsg: 'You must login first!'});
        }
        else {
            next();
        }
    }

    //User routs
    app.post('/user', userController.save);
    app.get('/users/', loginAuth, userController.list);
    app.get('/user/:id', loginAuth, userController.fetch);
    app.delete('/user/:id', loginAuth, userController.remove);

    //Login routes
    app.post('/login', loginController.authenticate);
    app.get('/logout', loginController.logOut);
    app.get('/loggedInUser', loginAuth, loginController.getLoggedInUser);

    //upload routes
    app.post('/fileUploadVideo', multipartMiddleware, FileUploadController.fileUpload1);
    app.get('/getFiless', FileUploadController.fileLocation);
    app.post('/removeFile', FileUploadController.removeFile);

};