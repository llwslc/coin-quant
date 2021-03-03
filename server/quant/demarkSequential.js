const log4js = require('log4js');
const axios = require('axios');
const sqlite = require('../sqlite.js');
const config = require('../config.js');

const logger = log4js.getLogger('dayUp');
logger.level = 'info';

const daySec = 24 * 60 * 60 * 1000;
let db = {};

const main = async () => {
  db = await sqlite(config.sqlite.dklines);

  const openTime = 0; //new Date('2021-01-01 00:00:00').getTime();
  const symbol = 'BTCUSDT';
  const klines = await db.allSync(`SELECT * FROM klines WHERE symbol = '${symbol}' and openTime > ${openTime};`);
  const {data} =  await axios.get(config.klinesUrl, {
    params: { symbol, interval: '1d', limit: 1 }
  });
  const [curKlines = []] = data

  klines.push({openTime: curKlines[0],
    open: curKlines[1],
    high: curKlines[2],
    low: curKlines[3],
    close: curKlines[4],
    volume:curKlines[5],
  });

  const DAY = 9
  const BEFORE_DAY = 4

  const upPoints = [];
  const downPoints = [];
  for (let i = (DAY + BEFORE_DAY); i < klines.length; i++) {
    if ( klines[i].close < klines[i-4].high) {
      return
    }
  }

  console.log('upPoints');
  for (const d of upPoints) {
    console.log(
      new Date(d.openTime).toLocaleDateString(),
    );
  }
  console.log('downPoints');
  for (const d of downPoints) {
    console.log(
      new Date(d.openTime).toLocaleDateString(),
    );
  }
};

main();
