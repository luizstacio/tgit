#!/usr/bin/env node

/*
  Global vars
*/
global.pathTgit = process.env._;
global.pathApp = process.env.PWD;

/*
  requires
*/
var tgit = require('./bin');