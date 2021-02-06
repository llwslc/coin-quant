const log4js = require('log4js');
const axios = require('axios');
const sqlite = require('./sqlite.js');
const config = require('./config.js');

const logger = log4js.getLogger('dklines');
logger.level = 'info';

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

const checkData = async (symbol) => {
  const data = await db.getSync(`SELECT * FROM klines WHERE symbol='${symbol}';`);
  let preTime = data[0].openTime;
  for (let i = 1, iLen = data.length; i < iLen; ++i) {
    const curTime = data[i].openTime;
    if (curTime - preTime !== 24 * 60 * 60 * 1000) {
      logger.error(
        `[${symbol}] CHECK ERROR: ${data[i - 1]}-${new Date(preTime).toLocaleString()}, ${data[i]}-${new Date(
          curTime
        ).toLocaleString()}, `
      );
    } else {
      preTime = curTime;
    }
  }
  logger.info(`[${symbol}] CHECK END`);
};

const getKlines = async (symbol, startTime = 0) => {
  try {
    // https://api.binance.com/api/v1/klines?symbol=ETHUSDT&interval=1d&limit=1000
    const klines = await axios.get(config.klinesUrl, {
      params: { symbol, interval: '1d', startTime, limit: 1000 }
    });
    const { data } = klines;
    // 去掉最新一天的数据
    const confirmData = data.slice(0, data.length - 1);

    if (confirmData.length === 1) {
      logger.info(`[${symbol}] NO MORE ${new Date(startTime).toLocaleString()}`);
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

    logger.info(`[${symbol}] INSERT END ${new Date(startTime).toLocaleString()}`);
    return await getKlines(symbol, maxOpenTime);
  } catch (error) {
    logger.error('GetKlines', new Date(startTime).toLocaleString(), error.message ? error.message : error);
    return await getKlines(symbol, startTime);
  }
};

const main = async () => {
  db = await sqlite(config.sqlite.dklines);
  const data = await getSymbols();
  for (const d of data.slice(0, 2)) {
    const symbol = d.symbol;
    const fiat = 'USDT';
    if (symbol.indexOf(fiat) === symbol.length - fiat.length) {
      const upFiat = 'UPUSDT';
      const downFiat = 'DOWNUSDT';
      const bullFiat = 'BULLUSDT';
      const bearFiat = 'BEARUSDT';
      if (
        symbol.indexOf(upFiat) !== symbol.length - upFiat.length &&
        symbol.indexOf(downFiat) !== symbol.length - downFiat.length &&
        symbol.indexOf(bullFiat) !== symbol.length - bullFiat.length &&
        symbol.indexOf(bearFiat) !== symbol.length - bearFiat.length
      ) {
        const data = await db.getSync(`SELECT MAX(openTime) AS openTime FROM klines WHERE symbol='${symbol}';`);
        const startTime = data[0].openTime ? data[0].openTime : undefined;
        await getKlines(symbol, startTime);
      }
    }
  }
};

main();
