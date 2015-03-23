'use strict';
var config = {};

config.file_upload = {};

// Port on which the server will be listening
config.port = process.env.PORT || 9804;
// Set 10 MB as the maximum allowed file size
config.file_upload.max_size = 10000000;
// Where the files will be stored
config.file_upload.directory = (process.env.UPLOAD_DIR || './uploads') + '/';

module.exports = config;