const log4js = require('log4js');
const axios = require('axios');
const sqlite = require('../sqlite.js');
const config = require('../config.js');

const logger = log4js.getLogger('goodCoin');
logger.level = 'info';

let db = {};

const main = async () => {
  db = await sqlite(config.sqlite.dklines);

  const klines = await db.allSync(`SELECT * FROM klines;`);
  const before2021 = new Date('2021-01-01 00:00:00').getTime();
  const at20210519 = new Date('2021-05-19 00:00:00').getTime();

  // 2017 最高
  // 2021 前最低
  // 2021/05/19 最低
  // 历史最高
  // 历史最低
  // 当前价格

  const allSymbols = {};
  for (const d of klines) {
    const symbol = d.symbol.replace(/(USDT$|BUSD$)/, '');
    const time = d.openTime;
    const open = Number(d.open);
    const close = Number(d.close);
    const high = Number(d.high);
    const low = Number(d.low);
    const curData = {
      time,
      open,
      close,
      high,
      low
    };

    if (!allSymbols[symbol]) {
      allSymbols[symbol] = {};
    }

    if (time < before2021) {
      if (!allSymbols[symbol].before2021High) {
        allSymbols[symbol].before2021High = curData;
      } else {
        if (high > allSymbols[symbol].before2021High.high) allSymbols[symbol].before2021High = curData;
      }
    }

    if (time >= before2021) {
      if (!allSymbols[symbol].after2021High) {
        allSymbols[symbol].after2021High = curData;
      } else {
        if (high > allSymbols[symbol].after2021High.high) allSymbols[symbol].after2021High = curData;
      }
    }
  }

  const formatDate = (d, p) => {
    return d ? `${new Date(d).toLocaleDateString()} - ${p}` : '';
  };

  Object.keys(allSymbols).forEach(s => {
    const d = allSymbols[s];
    const { before2021High = {}, after2021High = {} } = d;
    console.log(
      s,
      formatDate(before2021High.time, before2021High.high),
      formatDate(after2021High.time, after2021High.high)
    );
  });
};

main();
