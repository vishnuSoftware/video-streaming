/**
 * Created by vishnu on 13/6/16.
 */


var express = require('express');
var app = express();
var port = process.env.port || 9090;
var bodyParser = require('body-parser');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
app.use(cors());

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/NewProject');

app.use(bodyParser.urlencoded({limit: '50mb',extended: true}));
app.use(bodyParser.json({limit: '50mb'}));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.static('videos'));
app.use(cookieParser());
app.use(session({secret: 'keyboard cat', resave: false, saveUninitialized: true,cookie: { path: '/', httpOnly: true, maxAge: 30 * 30000 },rolling: true}));

require("./server/routes.js")(app);


app.listen(port);
console.log('App is listening on port: ' + port);