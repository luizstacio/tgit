'use strict';

var fs = require('fs');
var tgitConfig = require(pathApp + '/tgitconfig.json');
var config = require(pathTgit + '/config.json');
var Trello = require('node-trello');
var jsonFormat = require('json-format');
var t = new Trello(config.key, tgitConfig.token);
var cache = {};
var server = require('./server');
var openTrello = require('open');

/**
 * set new token
 */
function setNewToken (token) {
  t = new Trello(config.key, token);
}

/**
 * get configs
 * @return {Object} Configs.
 * @api public
 */
function getConfig () {
  return JSON.parse(fs.readFileSync(pathApp + '/tgitconfig.json', 'utf8'));
}

/**
 * save configs
 * @param {Object} Configs.
 * @param {Function} fn The callback function.
 * @param {Object} fn.data data return the request list
 * @api public
 */
function saveConfig (data, callback) {
  var config,
      tgitConfigFile = getConfig();

  for ( config in data ) {
    tgitConfigFile[config] = data[config];
  }

  fs.writeFileSync(pathApp + '/tgitconfig.json', jsonFormat(tgitConfigFile));
  setNewToken(tgitConfigFile.token);
  callback();
}


/**
 * get token access
 *
 * @param {Function} fn The callback function.
 * @param {Object} fn.err 
 * @param {Object} fn.data data return the request list
 * @api public
 */
function requestToken (callback) {
  server.initServer(function(url){
    openTrello( url + 'login' );
    console.log( url + 'login' );
  });
}

/**
 * list bords
 *
 * @param {Function} fn The callback function.
 * @param {Object} fn.err 
 * @param {Object} fn.data data return the request list
 * @api public
 */
function listBoards (callback) {
  t.get('/1/members/me', { card_members: true, boards: 'all', board_fields: 'name' }, function(err, data) {
    if (err) throw err;
    callback(data);
  });
}

/**
 * list cards
 *
 * @param {Function} fn The callback function.
 * @param {Object} fn.err 
 * @param {Object} fn.data data return the request list
 * @api public
 */
function list (callback) {

  if ( cache.list ) {
    callback.apply(callback, cache.list);
  } else {
    t.get('/1/boards/'+tgitConfig.board, tgitConfig.list, function ( err, data ) {
      if (err) throw err;
      cache.list = [err, data];
      callback.apply(callback, cache.list);
    });
  }
}

/**
 * send comment
 *
 * @param {Object} data.
 * @param {String} data.task id for task post comment
 * @param {String} data.text text of comment
 * @param {Function} fn The callback function.
 * @param {Object} fn.err 
 * @param {Object} fn.data data return the request list
 * @api public
 */
function comment (data, callback) {
  t.post('/1/cards/'+data.task+'/actions/comments', { text: data.text }, function(err, data) {
    if (err) throw err;
    callback(err, data);
  });
}

/**
 * send comment
 *
 * @param {Object} data.
 * @param {String} data.task id for task post comment
 * @param {String} data.list id for card change position
 * @param {Function} fn The callback function.
 * @param {Object} fn.err 
 * @param {Object} fn.data data return the request list
 * @api public
 */
function movecard (data, callback) {
  t.put('/1/cards/'+data.task, { idList: data.list }, function(err, data) {
    if (err) throw err;
    callback(err, data);
  });
}

module.exports = {
  list: list,
  comment: comment,
  movecard: movecard,
  requestToken: requestToken,
  listBoards: listBoards,
  saveConfig: saveConfig
};