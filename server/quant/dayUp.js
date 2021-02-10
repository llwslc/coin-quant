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

  const openTime = 0; // new Date('2021-01-01 00:00:00').getTime();
  const symbol = 'BTCUSDT';
  const klines = await db.allSync(`SELECT * FROM klines WHERE symbol = '${symbol}' AND openTime > ${openTime};`);
  console.log(klines.length);
  const uOdAll = { up: 0, down: 0, d: 'down' };
  const uOdByDay = {};
  for (const d of klines) {
    const openTime = d.openTime;
    const day = `周${new Date(openTime).getDay() + 1}`;
    if (!uOdByDay[day]) {
      uOdByDay[day] = { up: 0, down: 0 };
    }
    let up = uOdByDay[day].up;
    let down = uOdByDay[day].down;

    const open = Number(d.open);
    const close = Number(d.close);
    if (open < close) {
      up++;
      uOdAll.up++;
    } else {
      down++;
      uOdAll.down++;
    }

    uOdByDay[day] = { up, down };
  }

  for (const s in uOdByDay) {
    uOdByDay[s].d = 'down';
    if (uOdByDay[s].up > uOdByDay[s].down) {
      uOdByDay[s].d = 'up';
    }
  }
  if (uOdAll.up > uOdAll.down) {
    uOdAll.d = 'up';
  }

  console.log(symbol, uOdAll);
  const sortDay = Object.keys(uOdByDay).sort();
  for (const d of sortDay) {
    console.log(d, uOdByDay[d]);
  }
};

main();
