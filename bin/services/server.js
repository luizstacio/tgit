'use strict';

var tgitconfig = require(pathApp + '/tgitconfig.json');
var config = require('../../config.json')
var http = require('http');
var url = require('url');
var portfinder = require('portfinder');
var fs = require('fs');
var colors = require('colors');
var files = require('../public/files');

var OAuth = require('oauth').OAuth;
var requestURL = 'https://trello.com/1/OAuthGetRequestToken';
var accessURL = 'https://trello.com/1/OAuthGetAccessToken';
var authorizeURL = 'https://trello.com/1/OAuthAuthorizeToken';
var oauth;
var urlCallbackToken;
var secretToken;

var trello;

/**
 * request styles css
 *
 * @param {req} req from request.
 * @param {res} res from request.
 * @api private
 */
function styleRequest (req, res) {
  res.writeHead(200, { 'Content-type': 'text/css' });
  res.end(files.styles());
}

/**
 * save the ouath from request api trello
 *
 * @param {req} req from request.
 * @param {res} res from request.
 * @api private
 */
function saveOauth (req, res) {
  var query = url.parse(req.url, true).query,
      token = query.oauth_token,
      verifier = query.oauth_verifier;

  var trello = require('./trello');

  oauth.getOAuthAccessToken(token, secretToken, verifier, function(error, accessToken, accessTokenSecret) {
    if ( accessToken ) {
      trello.saveConfig({ token: accessToken }, function(){
        pageConfig(req, res);
      });
    }
  });
}

/**
 * save the ouath from request api trello
 *
 * @param {req} req from request.
 * @param {res} res from request.
 * @api private
 */
function saveConfig (req, res) {
  var query = url.parse(req.url, true).query,
      board = query.board;

  trello.saveConfig({ board: board }, function(){
    pageSuccess(req, res);
  });
}

/**
 * open the success page
 *
 * @param {req} req from request.
 * @param {res} res from request.
 * @api private
 */
function pageSuccess (req, res) {
  res.writeHead(200, { 'Content-type': 'text/html' });
  res.end(files.success());
  console.log('Saved success!'.green);
  setTimeout(function(){ process.exit(0) }, 100);
}

/**
 * open the config page
 *
 * @param {req} req from request.
 * @param {res} res from request.
 * @api private
 */
function pageConfig (req, res) {
  trello.listBoards(function(data){
    res.writeHead(200, { 'Content-type': 'text/html' });
    res.end(files.index(data));
  });
}

/**
 * request token
 *
 * @param {req} req from request.
 * @param {res} res from request.
 * @api private
 */
function requestToken (req, res) {
  oauth = new OAuth(requestURL, accessURL, config.key, config.secret, '1.0', urlCallbackToken + 'saveOatuh', 'HMAC-SHA1');

  oauth.getOAuthRequestToken(
    function(error, token, tokenSecret) {
      secretToken = tokenSecret;
      res.writeHead(302, {
        'Location': '' + authorizeURL + '?oauth_token=' + token + '&name=' + config.appName + '&expiration=never&scope=read,write'
      });
      res.end();
    }
  );
}

/**
 * process the request
 *
 * @param {Function} fn The callback function.
 * @param {Object} fn.stdout return success text
 * @api private
 */
function serverRequest (req, res) {
  if ( /login/.test(req.url) ) {
    requestToken(req, res);
  } else if ( /saveConfig/.test(req.url) ) { 
    saveConfig(req, res);
  } else if ( /saveOatuh/.test(req.url) ){
    saveOauth(req, res);
  } else if ( /style.css/.test(req.url) ) {
    styleRequest(req, res);
  } else {
    pageConfig(req, res)
  }
}

/**
 * init server of configs
 *
 * @param {Function} fn The callback function.
 * @param {Object} fn.stdout return success text
 * @api public
 */
function initServer (callback) {
  trello = require('./trello');

  portfinder.getPort(function (err, port) {
    http.createServer(serverRequest)
    .listen(port, tgitconfig.path, function () {
      urlCallbackToken = 'http://' + config.path + ':' + port + '/';
      callback(urlCallbackToken);      
    });
  });
};


module.exports = {
  initServer: initServer
}