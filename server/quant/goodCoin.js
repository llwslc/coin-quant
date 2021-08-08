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
  const before2021 = new Date('2021-01-01T00:00:00+00:00').getTime();
  const at20210519 = new Date('2021-05-19T00:00:00+00:00').getTime();

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

      if (!allSymbols[symbol].before2021Low) {
        allSymbols[symbol].before2021Low = curData;
      } else {
        if (low < allSymbols[symbol].before2021Low.low) allSymbols[symbol].before2021Low = curData;
      }
    }

    if (time >= before2021) {
      if (!allSymbols[symbol].after2021High) {
        allSymbols[symbol].after2021High = curData;
      } else {
        if (high > allSymbols[symbol].after2021High.high) allSymbols[symbol].after2021High = curData;
      }

      if (!allSymbols[symbol].after2021Low) {
        allSymbols[symbol].after2021Low = curData;
      } else {
        if (low < allSymbols[symbol].after2021Low.low) allSymbols[symbol].after2021Low = curData;
      }
    }

    if (time == at20210519) {
      if (!allSymbols[symbol].at20210519) {
        allSymbols[symbol].at20210519 = curData;
      }
    }

    if (time >= at20210519) {
      if (!allSymbols[symbol].after20210519High) {
        allSymbols[symbol].after20210519High = curData;
      } else {
        if (high > allSymbols[symbol].after20210519High.high) allSymbols[symbol].after20210519High = curData;
      }

      if (!allSymbols[symbol].after20210519Low) {
        allSymbols[symbol].after20210519Low = curData;
      } else {
        if (low < allSymbols[symbol].after20210519Low.low) allSymbols[symbol].after20210519Low = curData;
      }
    }

    if (!allSymbols[symbol].highest) {
      allSymbols[symbol].highest = curData;
    } else {
      if (high > allSymbols[symbol].highest.high) allSymbols[symbol].highest = curData;
    }

    if (!allSymbols[symbol].lowest) {
      allSymbols[symbol].lowest = curData;
    } else {
      if (low < allSymbols[symbol].lowest.low) allSymbols[symbol].lowest = curData;
    }

    if (!allSymbols[symbol].current) {
      allSymbols[symbol].current = curData;
    } else {
      if (time > allSymbols[symbol].current.time) allSymbols[symbol].current = curData;
    }

    Object.keys(allSymbols[symbol]).forEach(_ => {
      allSymbols[symbol][_] = {
        ...allSymbols[symbol][_],
        type: _
      };
    });
  }

  const formatDate = data => {
    const { type } = data;
    const dateString = (d, p) => {
      return `${new Date(d).toLocaleDateString().replace(/-/g, '/')}[${p}]`;
    };
    switch (type) {
      case 'before2021High':
        return ` 2021前高 ${dateString(data.time, data.high)}`;
      case 'after2021High':
        return ` 2021最高 ${dateString(data.time, data.high)}`;
      case 'before2021Low':
        return ` 2021前低 ${dateString(data.time, data.low)}`;
      case 'after2021Low':
        return ` 2021最低 ${dateString(data.time, data.low)}`;
      case 'at20210519':
        return ` 519最低 ${dateString(data.time, data.low)}`;
      case 'after20210519High':
        return ` 519后低 ${dateString(data.time, data.low)}`;
      case 'after20210519Low':
        return ` 519后高 ${dateString(data.time, data.high)}`;
      case 'highest':
        return ` 历高 ${dateString(data.time, data.high)}`;
      case 'lowest':
        return ` 史低 ${dateString(data.time, data.low)}`;
      case 'current':
        return ` 现价 ${dateString(data.time, data.close)}`;
      default:
        return '';
    }
  };

  Object.keys(allSymbols).forEach(s => {
    const d = allSymbols[s];
    const {
      before2021High = {},
      after2021High = {},
      before2021Low = {},
      after2021Low = {},
      at20210519 = {},
      after20210519High = {},
      after20210519Low = {},
      highest = {},
      lowest = {},
      current = {}
    } = d;
    const formatPrint = () => {
      console.log(
        `${s}${formatDate(before2021High)}${formatDate(after2021High)}${formatDate(highest)}${formatDate(
          at20210519
        )}${formatDate(before2021Low)}${formatDate(after2021Low)}${formatDate(after20210519High)}${formatDate(
          after20210519Low
        )}${formatDate(lowest)}${formatDate(current)}`
      );
    };

    // 2021 牛市没破前高
    if (before2021High.high > after2021High.high) {
      // formatPrint();
    }

    // 2021519 后破前高
    if (after20210519High.high >= highest.high) {
      // formatPrint();
    }

    // 当前低于 2021519
    if (at20210519.low >= current.close) {
      formatPrint();
    }
  });
};

main();
