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

  const ups = [];
  const downs = [];
  const all = [];
  const MAX_AMPL = 0.2;
  for (const d of klines) {
    const open = Number(d.open);
    const close = Number(d.close);
    const high = Number(d.high);
    const low = Number(d.low);

    if (open < close) {
      if ((high - low) / low > MAX_AMPL) {
        ups.push(d);
      }
    } else {
      if ((high - low) / low > MAX_AMPL) {
        downs.push(d);
      }
    }

    if ((high - low) / low > MAX_AMPL) {
      all.push(d);
    }
  }

  console.log('ups');
  for (const d of ups) {
    console.log(
      new Date(d.openTime).toLocaleDateString(),
      Number(d.open),
      Number(d.close),
      Number(d.high),
      Number(d.low)
    );
  }
  console.log('downs');
  for (const d of downs) {
    console.log(
      new Date(d.openTime).toLocaleDateString(),
      Number(d.open),
      Number(d.close),
      Number(d.high),
      Number(d.low)
    );
  }
  console.log('all');
  for (const d of all) {
    console.log(
      new Date(d.openTime).toLocaleDateString(),
      Number(d.open),
      Number(d.close),
      Number(d.high),
      Number(d.low),
      Number(d.open) > Number(d.close) ? 'down' : 'up'
    );
  }
};

main();
