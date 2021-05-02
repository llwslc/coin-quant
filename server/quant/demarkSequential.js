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

  // const openTime = 0; // new Date('2021-01-01 00:00:00').getTime();
  const openTime = Date.now() - 20 * daySec;
  const symbol = 'BTCUSDT';
  const klines = await db.allSync(`SELECT * FROM klines WHERE symbol = '${symbol}' and openTime > ${openTime};`);
  const { data } = await axios.get(config.klinesUrl, {
    params: { symbol, interval: '1d', limit: 1 }
  });
  const [curKlines = []] = data;

  klines.push({
    openTime: curKlines[0],
    open: curKlines[1],
    high: curKlines[2],
    low: curKlines[3],
    close: curKlines[4],
    volume: curKlines[5]
  });

  for (const k of klines) {
    k.open = Number(k.open);
    k.close = Number(k.close);
    k.high = Number(k.high);
    k.low = Number(k.low);
  }

  const DAY = 9;
  const BEFORE_DAY = 4;

  // const DAY = 7;
  // const BEFORE_DAY = 3;

  const topPoints = [];
  const confirmTopPoints = [];
  const bottomPoints = [];
  const confirmBottomPoints = [];

  const findTop = _arr => {
    for (let i = 0, iLen = _arr.length - BEFORE_DAY; i < iLen; ++i) {
      if (_arr[i].close > _arr[i + BEFORE_DAY].close) {
        return false;
      }
    }
    return true;
  };

  const findConfirmTop = _arr => {
    const idx = _arr.length - 1;
    if (_arr[idx].high > _arr[idx - 2].high && _arr[idx].high > _arr[idx - 3].high) {
      if (_arr[idx - 1].high > _arr[idx - 2].high && _arr[idx - 1].high > _arr[idx - 3].high) {
        return true;
      }
    }
    return false;
  };

  const findBottom = _arr => {
    for (let i = 0, iLen = _arr.length - BEFORE_DAY; i < iLen; ++i) {
      if (_arr[i].close < _arr[i + BEFORE_DAY].close) {
        return false;
      }
    }
    return true;
  };

  const findConfirmBottom = _arr => {
    const idx = _arr.length - 1;
    if (_arr[idx].low < _arr[idx - 2].low && _arr[idx].low < _arr[idx - 3].low) {
      if (_arr[idx - 1].low < _arr[idx - 2].low && _arr[idx - 1].low < _arr[idx - 3].low) {
        return true;
      }
    }
    return false;
  };

  const printArr = _arr => {
    return;

    console.log(`===========`);
    _arr.map(_ => {
      console.log(_.id, new Date(_.openTime).toLocaleDateString(), _.close, _.low);
    });
    console.log(`===========`);
  };

  for (let i = DAY + BEFORE_DAY; i <= klines.length; i++) {
    const arr = klines.slice(i - (DAY + BEFORE_DAY), i);
    if (findTop(arr)) {
      topPoints.push(klines[i - 1]);
      if (findConfirmTop(arr)) {
        confirmTopPoints.push(klines[i - 1]);
        printArr(arr);
      }
    }
    if (findBottom(arr)) {
      bottomPoints.push(klines[i - 1]);
      if (findConfirmBottom(arr)) {
        confirmBottomPoints.push(klines[i - 1]);
      }
    }
  }

  console.log('topPoints');
  for (const d of topPoints) {
    console.log(new Date(d.openTime).toLocaleDateString());
  }
  console.log('confirmTopPoints');
  for (const d of confirmTopPoints) {
    console.log(new Date(d.openTime).toLocaleDateString());
  }
  console.log('bottomPoints');
  for (const d of bottomPoints) {
    console.log(new Date(d.openTime).toLocaleDateString());
  }
  console.log('confirmBottomPoints');
  for (const d of confirmBottomPoints) {
    console.log(new Date(d.openTime).toLocaleDateString());
  }

  const lastDate = list => {
    if (list.length === 0) return '';

    return new Date(list[list.length - 1].openTime).toLocaleDateString();
  };

  console.log(`topPoints ${lastDate(topPoints)}`);
  console.log(`confirmTopPoints ${lastDate(confirmTopPoints)}`);
  console.log(`bottomPoints ${lastDate(bottomPoints)}`);
  console.log(`confirmBottomPoints ${lastDate(confirmBottomPoints)}`);
};

main();
