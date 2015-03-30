/**
 * Created by sduquej on 09/02/2015.
 */
 'use strict';
 module.exports = function (server, db, fs, config){
  //    unique index
  // TODO: remove, make it generic
  // db.appUsers.ensureIndex({
  //   email: 1
  // }, {
  //   unique: true
  // });

  // TODO: Instead of returning a list of data, return general stats
  // e.g.: total number of documents, documents in the last month
  // time elapsed since last contribution
  server.get('/api/v1/simpleForm/list', function (req, res, next) {
    db.appUsers.find({},{_id:0},function (err, list) {      
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8'
      });
      res.end(JSON.stringify(list));
    });
    return next();
  });

  server.post('api/v1/simpleForm/register', function (req, res, next){
    debugger;
    var userContribution = req.params;
    var file = req.files.file;      

    // If a file was uploaded get it to the configured upload directory
    debugger;
    if( file ){
      // Store the metadata about the uploaded file
      userContribution.files = JSON.parse(userContribution.files);
      
      fs.readFile(file.path, function(err, data){
        if(err){          
          res.writeHead(400, {
            'Content-Type': 'application/json; charset=utf-8'
          });
          res.end(JSON.stringify({
            error: err,
            message: 'An error ocurred when reading the uploaded file'
          }));
        }                 
        // Create a unique filename using the timestamp of the contribution
        // some characters are removed from the timestamp to avoid problems 
        // with filename restrictions in some OS's
        var filename = config.file_upload.directory + userContribution.timestamp.replace(/[-:.]/g,'')+'_'+file.name;
        fs.writeFile(filename, data, function(err){
          if (err) {
           res.end(JSON.stringify({
             error: err,
             message: 'Unexpected error when writing file'
            }));            
          }
          console.log('File saved @ ' + filename);
        });        
        return next();
        });
    }   
    
    
    db.appUsers.insert(userContribution, function (err, dbObject){
     if (err) {                      
      debugger;
       res.writeHead(400, {
         'Content-Type': 'application/json; charset=utf-8'
       });
       res.end(JSON.stringify({
         error: err,
         message: err.code + ' - could not insert in the db'
       }));       
     }else {   
      debugger;   
       res.writeHead(200, {
         'Content-Type': 'application/json; charset=utf-8'
       });
       res.end(JSON.stringify(dbObject));
     }
   });    
    return next();
  });

  // TODO: Clean up and remove this method if it will not be used.
  server.post('api/v1/simpleForm/upload', function (req, res, next) {    
    console.log('post request received');
    console.log('files:');
    console.log(req.files);    
    
    return next();
  });

};
