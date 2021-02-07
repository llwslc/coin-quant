const log4js = require('log4js');
const axios = require('axios');
const sqlite = require('./sqlite.js');
const config = require('./config.js');

const logger = log4js.getLogger('dklines');
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

const checkData = async symbol => {
  const data = await db.allSync(`SELECT * FROM klines WHERE symbol='${symbol}';`);
  let preTime = data[0].openTime;
  for (let i = 1, iLen = data.length; i < iLen; ++i) {
    const curTime = data[i].openTime;
    if (curTime - preTime !== daySec) {
      logger.error(
        `[${symbol}] CHECK ERROR: ${data[i - 1].openTime}-${new Date(preTime).toLocaleString()}, ${
          data[i].openTime
        }-${new Date(curTime).toLocaleString()}`
      );
    }
    preTime = curTime;
  }
  logger.info(`[${symbol}] CHECK END`);
};

const getKlines = async (symbol, startTime = 0) => {
  try {
    // 已有前一天的数据
    if (Date.now() - startTime < 2 * daySec) {
      return;
    }

    // https://api.binance.com/api/v1/klines?symbol=ETHUSDT&interval=1d&limit=1000
    const klines = await axios.get(config.klinesUrl, {
      params: { symbol, interval: '1d', startTime, limit: 1000 }
    });
    const { data } = klines;
    // 去掉最新一天的数据
    const confirmData = data.slice(0, data.length - 1);

    if (confirmData.length === 1) {
      logger.info(`[${symbol}] NO MORE ${new Date(startTime).toLocaleString()}`);

      const end = confirmData[0][0];
      if (Date.now() - end > 7 * daySec) {
        // 下架了
        await db.runSync(`INSERT OR IGNORE INTO delists (symbol, end) VALUES ('${symbol}', '${end}');`);
        logger.info(`[${symbol}] DELIST`);
      }

      return checkData(symbol);
    }

    const colNames = [
      'symbol',
      'openTime',
      'open',
      'high',
      'low',
      'close',
      'volume',
      'closeTime',
      'QuoteAssetVolume',
      'numberOfTrades',
      'takerBuyBaseAssetVolume',
      'takerBuyQuoteAssetVolume'
    ];
    let maxOpenTime = 0;
    for (const d of confirmData) {
      maxOpenTime = d[0];
      const val = d.slice(0, d.length - 1);
      await db.runSync(
        `INSERT OR IGNORE INTO klines (${colNames.join(', ')}) VALUES ('${[symbol, ...val].join("', '")}');`
      );
    }

    logger.info(`[${symbol}] INSERT END ${new Date(maxOpenTime).toLocaleString()}`);
    return await getKlines(symbol, maxOpenTime);
  } catch (error) {
    logger.error('GetKlines', new Date(startTime).toLocaleString(), error.message ? error.message : error);
    return await getKlines(symbol, startTime);
  }
};

const main = async () => {
  db = await sqlite(config.sqlite.dklines);
  const delistData = await db.allSync(`SELECT * FROM delists;`);
  const delistSymbols = [];
  for (const d of delistData) {
    delistSymbols.push(d.symbol);
  }

  const data = await getSymbols();
  const symbols = [];
  for (const d of data) {
    const symbol = d.symbol;
    const fiat = 'USDT';
    if (symbol.indexOf(fiat) === symbol.length - fiat.length) {
      const moreFiat = 'USD';
      const upFiat = 'UPUSDT';
      const downFiat = 'DOWNUSDT';
      const bullFiat = 'BULLUSDT';
      const bearFiat = 'BEARUSDT';
      if (
        symbol.match(new RegExp(moreFiat, 'g')).length === 1 &&
        symbol.indexOf(upFiat) === -1 &&
        symbol.indexOf(downFiat) === -1 &&
        symbol.indexOf(bullFiat) === -1 &&
        symbol.indexOf(bearFiat) === -1 &&
        !delistSymbols.includes(symbol)
      ) {
        symbols.push(symbol);
      }
    }
  }

  logger.info(`Delists: ${delistSymbols.length}, symbols: ${symbols.length}`);
  for (const s of symbols) {
    const data = await db.getSync(`SELECT MAX(openTime) AS openTime FROM klines WHERE symbol='${s}';`);
    const startTime = data[0].openTime ? data[0].openTime : undefined;
    await getKlines(s, startTime);
  }
};

main();
