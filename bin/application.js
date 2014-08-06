var colors = require('colors');
var commander = require('commander');
var tgit = require('./mediator/tgit');
var git = require('./services/git');
var stream = process.stdin;
var readline = require('readline');
var commandLine = '';

/**
 * remove path, command tgit, node of command line.
 */
commandLine = (function() {
  var newProcessArgv = process.argv.concat([]),
      commandString,
      pathString = process.env._;

  newProcessArgv.forEach(function(arg, index){
    if ( arg.search(/\ /g) !== -1 ) {
      newProcessArgv[index] = '"'+arg+'"';
    }
  });

  commandString = newProcessArgv.join(' ').replace(new RegExp(pathString, 'i'), '');
  commandString = commandString.replace(new RegExp(pathTgit + '/index.js', 'i'), '');
  commandString = commandString.replace(/tgit|node/i, '');

  return commandString;
}());

commander
  .version('0.0.1')
  .option('push, push', 'Include comment and move card in trello', task)
  .option('auth, auth', 'authentication trello', auth)
  .parse(process.argv);

if ( !commander.push && !commander.auth ) {
  git.command(commandLine, function(data){
    console.log(data.green);
    readline.moveCursor(stream, 0, -1);
    process.exit(0);
  });
}

function auth () {
  tgit.initConfig(function(){
    console.log('Success for get token access'.green);
    process.exit(0);
  });
}

function task () {

  if ( commandLine.indexOf('push') === -1 ) {
    console.log('The association is possible only in push command'.red);
    process.exit(0);
  }
  
  tgit.cards().on('select', function(cards){
    /* Validation */
    if ( !cards.length ) {
      console.log('Is required select one task'.red);
      process.exit(0);
    }

    tgit.lists().on('select', function(list){
      /* Validation */
      if ( !list ) {
        console.log('Is required select one list'.red);
        process.exit(0);
      }

      /* dataTrello */
      var data = {
        cards: cards,
        list: list
      };

      /* Msg whait... */
      console.log('\nSanving the changes'.green);
      /* Exec push */
      git.command(commandLine, function(stdout){
        /* Save changes */
        tgit.sendChanges(data, function(){
          console.log('Success'.green);
          process.exit(0);
        });
      });

    });
  });
}