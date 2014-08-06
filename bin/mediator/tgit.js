'use strict';

var colors = require('colors');
var select = require('select-shell');
var readline = require('readline');
var processOut = process.stdout;
var stream = process.stdin;

var trello = require('../services/trello');
var git = require('../services/git');

/**
 * start config tgit
 *
 * @param {Function} fn The callback function.
 * @param {Object} fn.data data return the request list
 * @api public
 */
function initConfig (callback) {
  trello.requestToken(callback);
}

/**
 * select cards/tasks
 *
 * @return {Object} select-shell component
 * @api public
 */
function cards () {
  var selectTask = select();

  console.log('\nSelect tasks: ');
  processOut.write('Carregando...'.green);
  
  trello.list(function(err, data){
    /* clean line */
    readline.cursorTo(stream, 0);
    readline.clearScreenDown(stream);
    
    /* list cards */
    data.cards.forEach(function(item){
      selectTask.option(item.name, item.id);
    });

    selectTask.list();
  });

  return selectTask;
}

/**
 * select list of destination
 * 
 * @return {Object} select-shell component
 * @api public lists
 */
function lists () {
  var selectList = select({
    multiSelect: false
  });

  console.log('\nSelect list to move: ');
  processOut.write('Carregando...'.green);

  trello.list(function(err, data){
    /* clean line */
    readline.cursorTo(stream, 0);
    readline.clearScreenDown(stream);
    
    /* list tasks */
    data.lists.forEach(function(item){
      selectList.option(item.name, item.id);
    });

    selectList.list();
  });

  return selectList;
}

/**
 * save changes 
 *
 * @param {Object} trelloData
 * @param {String[]} trelloData.cards ids of cards selected 
 * @param {String} trelloData.list id of list selected
 * @param {Function} fn The callback function.
 * @api public sendChanges
 */
function sendChanges (trelloData, callback) {
  var tasksResultlength = trelloData.cards.length - 1,
      cont = 0;

  git.getComment(function(comment){
    trelloData.cards.forEach(function (item, position) {
      
      function callbackResquests () {
        if ( position === tasksResultlength ) {
          ++cont;
          if ( cont === 2 ) {
            callback();
          }
        }
      }

      /* send comments */
      trello.comment({
        task: item.value,
        text: comment
      }, callbackResquests);

      /* change cards position */
      trello.movecard({
        task: item.value,
        list: trelloData.list.value
      }, callbackResquests);
    });
  });

}


module.exports = {
  cards: cards,
  lists: lists,
  sendChanges: sendChanges,
  initConfig: initConfig
};
