'use strict';

var tgitConfig = require(pathApp + '/tgitconfig.json');
var colors = require('colors');
var exec = require('child_process').exec;
var stream = process.stdin;
var readline = require('readline');

/**
 * exec commands
 *
 * @param {Function} fn The callback function.
 * @param {Object} fn.stdout return success text
 * @api public
 */
function command (cmd, callback) {
  exec('git ' + cmd, function (error, stdout, stderr) {
    callback(error || stdout || stderr);
  });
}

/**
 * get comment the last git commit
 *
 * @param {Function} fn The callback function.
 * @param {Object} fn.stdout return success text
 * @api public
 */
function getComment (callback) {
  exec('git log -1 --pretty=format:"'+tgitConfig.comment+'"', function (error, stdout, stderr) {
    if ( !stderr ) {
      callback(stdout);
    } else {
      console.log(stderr);
      readline.moveCursor(stream, 0, -1);
      process.exit(0);
    }
  });
}

module.exports = {
  command: command,
  getComment: getComment
};