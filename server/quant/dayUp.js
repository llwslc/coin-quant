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

  const openTime = new Date('2021-01-01 00:00:00').getTime();
  const klines = await db.allSync(`SELECT * FROM klines WHERE openTime > ${openTime};`);
  const uOdAll = {};
  const uOdByDay = {};

  for (const d of klines) {
    const symbol = d.symbol;
    if (!uOdByDay[symbol]) {
      uOdByDay[symbol] = {};
      uOdAll[symbol] = { up: 0, down: 0, d: 'ep' };
    }
    const uOd = uOdByDay[symbol];
    const uOdA = uOdAll[symbol];
    const openTime = d.openTime;
    const day = `周${new Date(openTime).getDay() + 1}`;
    if (!uOd[day]) {
      uOd[day] = { up: 0, down: 0 };
    }
    let up = uOd[day].up;
    let down = uOd[day].down;

    const open = Number(d.open);
    const close = Number(d.close);
    if (open < close) {
      up++;
      uOdA.up++;
    } else {
      down++;
      uOdA.down++;
    }

    uOd[day] = { up, down };
  }

  for (const s in uOdByDay) {
    const uOd = uOdByDay[s];
    for (const d in uOd) {
      uOd[d].d = 'ep';
      if (uOd[d].up > uOd[d].down) {
        uOd[d].d = 'up';
      }
      if (uOd[d].up < uOd[d].down) {
        uOd[d].d = 'down';
      }
    }
    if (uOdAll[s].up > uOdAll[s].down) {
      uOdAll[s].d = 'up';
    }
    if (uOdAll[s].up < uOdAll[s].down) {
      uOdAll[s].d = 'down';
    }
  }

  const showSymbol = ['BTCUSDT', 'ETHUSDT', 'LINKUSDT'];
  for (const s of showSymbol) {
    console.log(s, uOdAll[s]);
    const sortDay = Object.keys(uOdByDay[s]).sort();
    for (const d of sortDay) {
      console.log(d, uOdByDay[s][d]);
    }
  }

  const uOdByDayRes = {};
  for (const s in uOdByDay) {
    const uOd = uOdByDay[s];
    for (const d in uOd) {
      if (!uOdByDayRes[d]) {
        uOdByDayRes[d] = { upCoins: 0, downCoins: 0, epCoins: 0, d: 'down' };
      }
      if (uOd[d].d === 'up') {
        uOdByDayRes[d].upCoins++;
      }
      if (uOd[d].d === 'down') {
        uOdByDayRes[d].downCoins++;
      }
      if (uOd[d].d === 'ep') {
        uOdByDayRes[d].epCoins++;
      }
    }
  }

  console.log('ALL COINS');
  for (const d in uOdByDayRes) {
    uOdByDayRes[d].d = 'ep';
    if (uOdByDayRes[d].upCoins > uOdByDayRes[d].downCoins) {
      uOdByDayRes[d].d = 'up';
    }
    if (uOdByDayRes[d].upCoins < uOdByDayRes[d].downCoins) {
      uOdByDayRes[d].d = 'down';
    }
  }
  const sortDay = Object.keys(uOdByDayRes).sort();
  for (const d of sortDay) {
    console.log(d, uOdByDayRes[d]);
  }
};

main();
