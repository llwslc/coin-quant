const log4js = require('log4js');
const axios = require('axios');
const sqlite = require('./sqlite.js');
const config = require('./config.js');

const logger = log4js.getLogger('klines');
logger.level = 'info';

const symbol = process.env.SYMBOL;
let db = {};

const checkData = async () => {
  const data = await db.getSync(`SELECT * FROM klines;`);
  let preTime = data[0].openTime;
  for (let i = 1, iLen = data.length; i < iLen; ++i) {
    const curTime = data[i].openTime;
    if (curTime - preTime !== 24 * 60 * 60 * 1000) {
      logger.error(
        `CHECK ERROR: ${data[i - 1]}-${new Date(preTime).toLocaleString()}, ${data[i]}-${new Date(
