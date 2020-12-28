const fs = require('fs');
const path = require('path');
const log4js = require('log4js');
const config = require('./config.js');
const sqlite3 = require('sqlite3').verbose();

const logger = log4js.getLogger('sqlite');
const dbPath = config.sqlite.path;

if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath);
}

const dbOpen = async dbFile => {
  return new Promise((reslove, reject) => {
    const db = new sqlite3.Database(dbFile, error => {
      if (error) {
        return reject(error);
      }
      logger.info(`${dbFile} Open successfully`);
      db.getSync = async (sql, param) => {
        return new Promise((reslove, reject) => {
          db.get(sql, param, (error, res) => {
            if (error) return reject(error);
            reslove(res ? [res] : []);
          });
        });
      };
      db.allSync = async (sql, param) => {
        return new Promise((reslove, reject) => {
          db.all(sql, param, (error, res) => {
            if (error) return reject(error);
            reslove(res);
          });
        });
      };
      db.runSync = async (sql, param) => {
        return new Promise((reslove, reject) => {
          db.run(sql, param, function (error) {
            if (error) return reject(error);
            reslove({ lastID: this.lastID, changes: this.changes });
          });
        });
      };
      db.execSync = async sql => {
        return new Promise((reslove, reject) => {
          db.exec(sql, error => {
            if (error) return reject(error);
            reslove(true);
          });
        });
      };
      reslove(db);
    });
  });
};

const db = async dbName => {
  try {
    const dbFile = path.join(dbPath, `${dbName}.db`);
    const dbObj = await dbOpen(dbFile);
    const klines = await dbObj.getSync(`SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'klines'`);
    if (klines.length == 0) {
      /*
          [
            1499040000000,      // Open time 开盘时间
            "0.01634790",       // Open 开盘价
            "0.80000000",       // High 最高价
            "0.01575800",       // Low 最低价
            "0.01577100",       // Close 收盘价(当前K线未结束的即为最新价)
            "148976.11427815",  // Volume 成交量
            1499644799999,      // Close time 收盘时间
            "2434.19055334",    // Quote asset volume 成交额
            308,                // Number of trades 成交笔数
            "1756.87402397",    // Taker buy base asset volume 主动买入成交量
            "28.46694368",      // Taker buy quote asset volume 主动买入成交额
            "17928899.62484339" // 请忽略该参数
          ]
      */
      await dbObj.runSync(`CREATE TABLE "klines" (
        "id"	INTEGER NOT NULL,
        "openTime"	INTEGER NOT NULL UNIQUE,
        "open"	TEXT NOT NULL,
        "high"	TEXT NOT NULL,
        "low"	TEXT NOT NULL,
        "close"	TEXT NOT NULL,
        "volume"	TEXT NOT NULL,
        "closeTime"	INTEGER NOT NULL,
        "QuoteAssetVolume"	TEXT NOT NULL,
        "numberOfTrades"	INTEGER NOT NULL,
        "takerBuyBaseAssetVolume"	TEXT NOT NULL,
        "takerBuyQuoteAssetVolume"	TEXT NOT NULL,
        PRIMARY KEY("id" AUTOINCREMENT)
      );`);
    }
    return dbObj;
  } catch (error) {
    logger.error(`DB Error:`, error.message ? error.message : error);
  }
};

module.exports = db;
