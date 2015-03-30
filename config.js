'use strict';
var config = {};

// database authentication
config.db = {
  user = process.env.CSDB_USER,
  password = process.env.CSDB_PASSWORD,
  host1 = ds039211.mongolab.com,
  port1 = 39211,
  database = citizenscience_mu
};

config.file_upload = {};

// Port on which the server will be listening
config.port = process.env.PORT || 9804;
// Set 10 MB as the maximum allowed file size
config.file_upload.max_size = 10000000;
// Where the files will be stored
config.file_upload.directory = (process.env.UPLOAD_DIR || './uploads') + '/';

module.exports = config;