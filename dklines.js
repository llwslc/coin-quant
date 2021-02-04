const log4js = require('log4js');
const axios = require('axios');
const sqlite = require('./sqlite.js');
const config = require('./config.js');

const logger = log4js.getLogger('klines');
logger.level = 'info';

let db = {};

const checkData = async () => {
  const data = await db.getSync(`SELECT * FROM klines;`);
  let preTime = data[0].openTime;
  for (let i = 1, iLen = data.length; i < iLen; ++i) {
    const curTime = data[i].openTime;
    if (curTime - preTime !== 24 * 60 * 60 * 1000) {
      logger.error(
        `CHECK ERROR: ${data[i - 1]}-${new Date(preTime).toLocaleString()}, ${data[i]}-${new Date(
          curTime
        ).toLocaleString()}, `
      );
    } else {
      preTime = curTime;
    }
  }
  logger.info(`CHECK END`);
};

const getKlines = async (startTime = 0) => {
  try {
    // https://api.binance.com/api/v1/klines?symbol=ETHUSDT&interval=1h&limit=1000
    const klines = await axios.get(config.klinesUrl, {
      params: { symbol, interval: '1h', startTime, limit: 1000 }
    });
    const { data } = klines;
    // 去掉最新一小时的数据
    const confirmData = data.slice(0, data.length - 1);

    if (confirmData.length === 1) {
      logger.info(`NO MORE ${new Date(startTime).toLocaleString()}`);
      return checkData();
    }

    const colNames = [
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
      await db.runSync(`INSERT OR IGNORE INTO klines (${colNames.join(', ')}) VALUES ('${val.join("', '")}');`);
    }

    logger.info(`INSERT END ${new Date(startTime).toLocaleString()}`);
    return await getKlines(maxOpenTime);
  } catch (error) {
    logger.error(error.message ? error.message : error, new Date(startTime).toLocaleString());
    return await getKlines(startTime);
  }
};

const main = async () => {
  db = await sqlite(config.sqlite.dklines);
  const data = await db.getSync(`SELECT MAX(openTime) AS openTime FROM klines;`);
  const startTime = data[0].openTime ? data[0].openTime : undefined;
  getKlines(startTime);
};

main();
