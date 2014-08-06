/*
  requires
*/
var fs = require('fs');
var jsonFormat = require('json-format');
var readline = require('readline');
var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
var preConfig = require('../config').tgitconfig;


(function(){
    fs.stat(pathApp + '/tgitconfig.json', function (err, stats) {
      if (err) {
        rl.question('File tgitconfig.json not found! \nCreate now?(y/n)  ', function(response) {
          if ( response === '' || response === 'y' ) {
            fs.writeFileSync(pathApp + '/tgitconfig.json', jsonFormat(preConfig));
            require('./application');
          } else {
            process.exit(0); 
          }
        });
      } else {
        require('./application');
      }
    });
}());