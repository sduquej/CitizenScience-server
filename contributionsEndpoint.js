/**
 * Created by sduquej on 09/02/2015.
 */
 'use strict';
 module.exports = function (server, db, fs, config){
  // DB collection that will be used
  var collection =  config.db.collection;
  
  // Quit server on non-existing db collection
  if(!db[collection]){
    console.error('The collection [' + collection + 
      '] does not exist in the database, check your configuration.');
    process.exit(1);
  }

  // REST endpoint for list of contributions, offloads to the client the 
  // computing of the statistics.
  server.get('/api/v1/contributions/list', function (req, res, next){
    // Get the list ignoring the _id field
    db[collection].find({},{_id:0},function (err, list){      
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8'
      });
      res.end(JSON.stringify(list));
    });
    return next();
  });

  // REST endpoint for registering a new contribution
  server.post('/api/v1/contributions/register', function (req, res, next){
    var userContribution = req.params,
        file = req.files.file,
        filename;
   
    // If a file was uploaded get it to the configured upload directory
    if (file){
      // Create a unique filename using the timestamp of the contribution
      // some characters are removed from the timestamp to avoid problems 
      // with filename restrictions in some OS's
      var filename = config.file_upload.directory + userContribution.timestamp.replace(/[-:.]/g,'')+'_'+file.name;
      // Store the metadata about the uploaded file
      userContribution.files = file.name;
      
      fs.readFile(file.path, function(err, data){
        if (err){
          console.error('Error in readFile:\n',JSON.stringify(err));
          res.writeHead(400, {
            'Content-Type': 'application/json; charset=utf-8'
          });
          res.end(JSON.stringify({
            error: err,
            message: 'An error ocurred when reading the uploaded file'
          }));
        }                 
        
        fs.writeFile(filename, data, function(err){
          if (err){
            console.error('Error in writeFile:\n',JSON.stringify(err));
            res.end(JSON.stringify({
              error: err,
              message: 'Unexpected error when writing file'
            }));            
          }
          console.log('File uploaded @ ' + filename);
        });        
        return next();
        });
    }   
    // Include the IP address for data audit purposes
    userContribution._ip_address_ = req.headers['x-forwarded-for'] || 
                                      req.connection.remoteAddress;

    // Write on the db
    db[collection].insert(userContribution, function (err, dbObject){
     if (err){                      
       console.error('Error in insertDB:\n',JSON.stringify(err));
       res.writeHead(400, {
         'Content-Type': 'application/json; charset=utf-8'
       });
       res.end(JSON.stringify({
         error: err,
         message: err.code + ' - could not insert in the db'
       }));       
     } else {   
       res.writeHead(200, {
         'Content-Type': 'application/json; charset=utf-8'
       });
       res.end(JSON.stringify(dbObject));
     }
   });    
    return next();
  });

};
