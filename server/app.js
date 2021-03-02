const express = require('express');
const bodyParser = require('body-parser');
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

app.use(bodyParser.json());

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
  let result = {};
  try {
    const daySec = 24 * 60 * 60 * 1000;
    const openTime = Date.now() - 20 * daySec;
    const klines = await db.allSync(`SELECT * FROM klines WHERE openTime > '${openTime}';`);
    const [curPrices, dayVolume, coinsInfo] = await Promise.all([
      axios.get(config.priceUrl),
      axios.get(config.volumeUrl),
      axios.get(config.research)
    ]);
    const { data: prices } = curPrices;
    const { data: volumes } = dayVolume;
    const { data: coins } = coinsInfo;
    const volObj = {};

    const klinesData = {};
    for (const k of klines) {
      const symbol = k.symbol;
      const d = [k.openTime, k.open, k.close, k.low, k.high, k.QuoteAssetVolume];
      if (klinesData[symbol]) {
        klinesData[symbol].push(d);
      } else {
        klinesData[symbol] = [d];
      }
    }

    for (const v of volumes) {
      volObj[v.symbol] = v.quoteVolume;
    }

    for (const p of prices) {
      const symbol = p.symbol;
      if (klinesData[symbol]) {
        const lastIdx = klinesData[symbol].length - 1;
        const lastObj = klinesData[symbol][lastIdx];

        const open = lastObj[2];
        const close = p.price;
        const low = Number(open) > Number(close) ? close : open;
        const high = Number(open) > Number(close) ? open : close;
        const volume = volObj[symbol];

        const latestObj = [lastObj[0] + daySec, open, close, low, high, volume];
        klinesData[symbol].push(latestObj);
      }
    }

    result = { klines: klinesData, coins };
  } catch (error) {
    logger.error('[klines]', error.message ? error.message : error);
  }
  res.send(result);
});

app.get('/api/favs', async (req, res) => {
  let result = [];
  try {
    const name = req.query.name;
    if (name) {
      const favs = await db.getSync(`SELECT * FROM favs WHERE name = '${name}';`);
      if (favs.length) {
        result = JSON.parse(favs[0].symbols);
      }
    }
  } catch (error) {
    logger.error('[favsGet]', error.message ? error.message : error);
  }
  res.send(result);
});

app.post('/api/favs', async (req, res) => {
  const result = { code: 200, msg: '' };
  try {
    const name = req.body.name;
    const favs = req.body.favs;
    if (name && favs) {
      await db.runSync(`REPLACE INTO favs (name, symbols) VALUES ('${name}', '${JSON.stringify(favs)}') ;`);
    } else {
      result.code = 401;
    }
  } catch (error) {
    logger.error('[favsSet]', error.message ? error.message : error);
  }
  res.status(result.code).send({});
});

app.listen(port, () => {
  logger.info(`Listening at ${port}`);
});
