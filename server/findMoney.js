const log4js = require('log4js');
const axios = require('axios');
const sqlite = require('./sqlite.js');
const config = require('./config.js');

const logger = log4js.getLogger('findMoney');
logger.level = 'info';

const daySec = 24 * 60 * 60 * 1000;
let db = {};

const getSymbols = async () => {
  try {
    const price = await axios.get(config.priceUrl);
    const { data } = price;
    return data;
  } catch (error) {
    logger.error('[GetSymbols]', error.message ? error.message : error);
    return await getSymbols();
  }
};

const symbolPrice = async () => {
  const openTime = Date.now() - 20 * daySec;
  const klines = await db.allSync(`SELECT * FROM klines WHERE openTime > '${openTime}';`);
  const prices = await getSymbols();
  // const klines = await db.allSync(`SELECT * FROM klines WHERE openTime > '${openTime}' AND symbol = 'BTCUSDT';`);
  // const prices = [];

  const symbolOpen = {};
  const symbolClose = {};
  for (const k of klines) {
    const symbol = k.symbol;
    if (symbolOpen[symbol]) {
      symbolOpen[symbol].push(k.open);
    } else {
      symbolOpen[symbol] = [k.open];
    }

    if (symbolClose[symbol]) {
      symbolClose[symbol].push(k.close);
    } else {
      symbolClose[symbol] = [k.close];
    }
  }

  for (const p of prices) {
    const symbol = p.symbol;
    if (symbolOpen[symbol]) {
      const last = symbolClose[symbol].length - 1;
      symbolOpen[symbol].push(symbolClose[symbol][last]);
    }
    if (symbolClose[symbol]) {
      symbolClose[symbol].push(p.price);
    }
  }

  return {
    symbolOpen,
    symbolClose
  };
};

const movingAvg = (data = [], size = 7) => {
  const res = {};
  const symbols = Object.keys(data);

  const sum = arr => {
    let len = arr.length;
    let num = 0;
    while (len--) num += Number(arr[len]);
    return num;
  };

  const avg = (arr, idx, size) => {
    return sum(arr.slice(idx - size, idx)) / size;
  };

  const ma = (arr, size) => {
    const res = [];
    const len = arr.length + 1;
    let idx = size - 1;
    while (++idx < len) {
      res.push(avg(arr, idx, size));
    }
    return res;
  };

  for (const s of symbols) {
    const arr = data[s];
    if (arr.length > size) {
      res[s] = ma(arr, size);
    }
  }

  return res;
};

const findNew = (data, size = 7) => {
  const res = [];
  const symbols = Object.keys(data);

  for (const s of symbols) {
    const arr = data[s];
    if (arr.length < size) {
      res.push(s);
    }
  }

  return res;
};

const findPoint = (open, close) => {
  // 持续上涨
  const ups = [];
  const upsFunc = data => {
    if (data[0] < 0 && data[1] < 0 && data[2] < 0) {
      return true;
    }
    return false;
  };
  // 持续下跌
  const downs = [];
  const downsFunc = data => {
    if (data[0] > 0 && data[1] > 0 && data[2] > 0) {
      return true;
    }
    return false;
  };
  // 暴力上涨
  const fastUps = [];
  const fastUpsFunc = data => {
    if (data[0] < 0 && data[1] < 0 && data[2] < 0) {
      if (data[0] < data[1] * 1.5) {
        return true;
      }
    }
    return false;
  };
  // 暴力下跌
  const fastDowns = [];
  const fastDownsFunc = data => {
    if (data[0] > 0 && data[1] > 0 && data[2] > 0) {
      if (data[0] > data[1] * 1.5) {
        return true;
      }
    }
    return false;
  };
  // 微弱上涨
  const slowUps = [];
  const slowUpsFunc = data => {
    if (data[0] < 0 && data[1] < 0 && data[2] < 0) {
      if (data[0] > data[1] * 1.5) {
        return true;
      }
    }
    return false;
  };
  // 微弱下跌
  const slowDowns = [];
  const slowDownsFunc = data => {
    if (data[0] > 0 && data[1] > 0 && data[2] > 0) {
      if (data[0] < data[1] * 1.5) {
        return true;
      }
    }
    return false;
  };
  // 涨到顶部
  const tops = [];
  const topsFunc = data => {
    if (data[0] < 0 && data[0] > data[1] * 0.1) {
      return true;
    }
    if (data[0] > 0 && data[1] < 0) {
      return true;
    }
    if (data[0] > 0 && data[2] < 0) {
      return true;
    }
    return false;
  };
  // 跌到底部
  const bottoms = [];
  const bottomsFunc = data => {
    if (data[0] > 0 && data[0] < data[1] * 0.1) {
      return true;
    }
    if (data[0] < 0 && data[1] > 0) {
      return true;
    }
    if (data[0] < 0 && data[2] > 0) {
      return true;
    }
    return false;
  };
  // 确认顶部
  const fuckingTops = [];
  const fuckingTopsFunc = data => {
    if (data[0] > 0 && data[1] > 0 && data[2] < 0) {
      return true;
    }
    if (data[0] > 0 && data[1] > 0 && data[2] > 0 && data[3] > 0) {
      if (data[0] > data[1] * 1.1 && data[1] > data[2] * 1.5 && data[3] > data[2] * 1.5) {
        return true;
      }
    }
    return false;
  };
  // 确认底部
  const fuckingBottoms = [];
  const fuckingBottomsFunc = data => {
    if (data[0] < 0 && data[1] < 0 && data[2] > 0) {
      return true;
    }
    if (data[0] < 0 && data[1] < 0 && data[2] < 0 && data[3] < 0) {
      if (data[0] < data[1] * 1.1 && data[1] < data[2] * 1.5 && data[3] < data[2] * 1.5) {
        return true;
      }
    }
    return false;
  };

  const symbols = Object.keys(open);
  for (const s of symbols) {
    const o = open[s].reverse();
    const c = close[s].reverse();
    const difs = o.map((_, i) => {
      return _ - c[i];
    });

    if (upsFunc(difs)) {
      ups.push(s);
    }
    if (downsFunc(difs)) {
      downs.push(s);
    }
    if (fastUpsFunc(difs)) {
      fastUps.push(s);
    }
    if (fastDownsFunc(difs)) {
      fastDowns.push(s);
    }
    if (slowUpsFunc(difs)) {
      slowUps.push(s);
    }
    if (slowDownsFunc(difs)) {
      slowDowns.push(s);
    }
    if (topsFunc(difs)) {
      tops.push(s);
    }
    if (bottomsFunc(difs)) {
      bottoms.push(s);
    }
    if (fuckingTopsFunc(difs)) {
      fuckingTops.push(s);
    }
    if (s === 'YFIUSDT') {
      console.log(difs);
    }
    if (fuckingBottomsFunc(difs)) {
      fuckingBottoms.push(s);
    }
  }

  return { ups, downs, fastUps, fastDowns, slowUps, slowDowns, tops, bottoms, fuckingTops, fuckingBottoms };
};

const main = async () => {
  db = await sqlite(config.sqlite.dklines);

  const { symbolOpen, symbolClose } = await symbolPrice();
  const openMA = movingAvg(symbolOpen);
  const closeMA = movingAvg(symbolClose);
  const newSymbol = findNew(symbolOpen);
  const { ups, downs, fastUps, fastDowns, slowUps, slowDowns, tops, bottoms, fuckingTops, fuckingBottoms } = findPoint(
    openMA,
    closeMA
  );

  console.log(`总数: ${Object.keys(openMA).length}`);
  console.log(`新币: ${newSymbol.length}`);
  console.log(`持续上涨: ${ups.length}`);
  console.log(`持续下跌: ${downs.length}`);
  console.log(`暴力上涨: ${fastUps.length}`);
  console.log(`暴力下跌: ${fastDowns.length}`);
  console.log(`微弱上涨: ${slowUps.length}`);
  console.log(`微弱下跌: ${slowDowns.length}`);
  console.log(`涨到顶部: ${tops.length}`);
  console.log(`跌到底部: ${bottoms.length}`);
  console.log(`确认顶部: ${fuckingTops.length}`);
  console.log(`确认底部: ${fuckingBottoms.length}`);

  console.log({
    newSymbol,
    ups,
    downs,
    fastUps,
    fastDowns,
    slowUps,
    slowDowns,
    tops,
    bottoms,
    fuckingTops,
    fuckingBottoms
  });
};

main();
