/**
 * Created by sduquej on 09/02/2015.
 */
'use strict';
// Dependencies
// File and Operating Systems modules
var fs = require('fs'),
  os = require('os'),
// Restify enables us to build correct REST web services
  restify = require('restify'),
// Provides an adapter to the offical mongo api
  mongojs = require('mongojs'),
// Request logger middleware
  morgan = require('morgan'),
// Configuration options
  config = require('./config'),
  dbcfg = config.db;

// Check that the DB authentication variables are properly set up
if (!(dbcfg.user && dbcfg.password)){
  console.error('Environment variables for DB authentication are not properly set.')
  process.exit(1);
}

// Mongo connection string URI
// http://docs.mongodb.org/v2.6/reference/connection-string/
var connectionString = 'mongodb://' + dbcfg.user + ':' + dbcfg.password + '@'
      + dbcfg.host1 + ':' + dbcfg.port1 + '/' + dbcfg.database;

// Create a database object using the mongojs adapter
var db = mongojs(connectionString, [dbcfg.collection]),
// Use a local db, for development
// var db = mongojs('simpleFormApp', ['contributionsq']),
// REST server
  server = restify.createServer();

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

var contributionsEndpoint = require('./contributionsEndpoint')(server, db, fs, config);