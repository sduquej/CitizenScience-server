/**
 * Created by sduquej on 09/02/2015.
 */
'use strict';
// Dependencies
// File and Operating Systems modules
var fs = require('fs');
var os = require('os');
// Restify enables us to build correct REST web services
var restify = require('restify');
// Provides an adapter to the offical mongo api
var mongojs = require('mongojs');
// Request logger middleware
var morgan = require('morgan');
// Configuration options
var config = require('./config');

// Create a database object using the mongojs adapter
var db = mongojs('simpleFormApp', ['appUsers']);

// REST server
var server = restify.createServer({
  "name": "REST Server"
});

// Request Handling options
// http://mcavage.me/node-restify/#bundled-plugins
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser(
{
  maxBodySize: config.file_upload.max_size,
  uploadDir: os.tmpdir()
}));

server.use(morgan('dev'));

// Cross Origin Request Sharing - CORS
server.use(function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Starting the server
server.listen(config.port, function() {
    console.log('Server started @ ',config.port);    
});

var manageUsers = require('./manageUser')(server, db, fs, config);