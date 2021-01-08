const log4js = require('log4js');
const axios = require('axios');
const sqlite = require('./sqlite.js');
const config = require('./config.js');

const logger = log4js.getLogger('klines');
logger.level = 'info';

const symbol = process.env.SYMBOL;
let db = {};

