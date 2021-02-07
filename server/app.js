const express = require('express');
const axios = require('axios');
const log4js = require('log4js');
const sqlite = require('./sqlite.js');
const config = require('./config.js');

const logger = log4js.getLogger('backend');
logger.level = 'info';

const app = express();
const port = config.express.port;
let db = {};

sqlite(config.sqlite.dklines)
  .then(_ => {
    db = _;
  })
  .catch(_ => {
    logger.error(_);
  });

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

  if (req.method == 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.get('/api/klines', async (req, res) => {
  const result = {};
  try {
    const daySec = 24 * 60 * 60 * 1000;
    const openTime = Date.now() - 20 * daySec;
    const klines = await db.allSync(`SELECT * FROM klines WHERE openTime > '${openTime}';`);
    const curPrices = await axios.get(config.priceUrl);
    const { data: prices } = curPrices;

    for (const k of klines) {
      const symbol = k.symbol;
      const d = [k.openTime, k.open, k.close, k.low, k.high, k.volume];
      if (result[symbol]) {
        result[symbol].push(d);
      } else {
        result[symbol] = [d];
      }
    }

    for (const p of prices) {
      const symbol = p.symbol;
      if (result[symbol]) {
        const lastIdx = result[symbol].length - 1;
        const lastObj = result[symbol][lastIdx];

        const open = lastObj[2];
        const close = p.price;
        const low = open > close ? close : open;
        const high = open > close ? open : close;
        const volume = lastObj[5];

        const latestObj = [lastObj[0] + daySec, open, close, low, high, volume];
        result[symbol].push(latestObj);
      }
    }
  } catch (error) {
    logger.error('[klines]', error.message ? error.message : error);
  }
  res.send(result);
});

app.listen(port, () => {
  logger.info(`Listening at ${port}`);
});
