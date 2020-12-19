const fs = require('fs');
const path = require('path');
const log4js = require('log4js');
const config = require('./config.js');
const sqlite3 = require('sqlite3').verbose();

const logger = log4js.getLogger('sqlite');
const dbPath = config.sqlite.path;

if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath);
}

const dbOpen = async dbFile => {
  return new Promise((reslove, reject) => {
