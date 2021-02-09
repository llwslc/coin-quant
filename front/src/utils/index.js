import config from '../config';

export const readFavorites = () => {
  try {
    const favs = window.localStorage.getItem(config.localStorage.favKey);
    return JSON.parse(favs) || [];
  } catch (error) {
    return [];
  }
};

export const saveFavorites = symbols => {
  window.localStorage.setItem(config.localStorage.favKey, JSON.stringify(symbols));
};

export const findNew = (data, size = 7) => {
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

export const movingAvg = (data = [], size = 7) => {
  let res = [];

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

  if (data.length > size) {
    res = ma(data, size);
  }

  return res;
};

export const findPoint = data => {
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
  // 处于顶部
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
  // 处于底部
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
  // 上涨买点
  const upBuys = [];
  const upBuysFunc = (open, close, oma, cma) => {
    const min = Math.min(open[0], close[0]);
    if (min < cma[0]) {
      return true;
    }
    return false;
  };
  // 下跌买点
  const downBuys = [];
  const downBuysFunc = (open, close, oma, cma) => {
    const min = Math.min(open[0], close[0]);
    if (min < cma[0] * 0.9) {
      return true;
    }
    return false;
  };
  // 上涨卖点
  const upSells = [];
  const upSellsFunc = (open, close, oma, cma) => {
    const max = Math.max(open[0], close[0]);
    if (max > cma[0] * 1.1) {
      return true;
    }
    return false;
  };
  // 下跌卖点
  const downSells = [];
  const downSellsFunc = (open, close, oma, cma) => {
    const max = Math.max(open[0], close[0]);
    if (max > cma[0]) {
      return true;
    }
    return false;
  };

  const symbols = Object.keys(data);
  for (const s of symbols) {
    const d = data[s];
    const open = [];
    const close = [];
    for (const _ of d) {
      open.push(_[1]);
      close.push(_[2]);
    }
    const orv = [...open].reverse();
    const crv = [...close].reverse();
    const oma = movingAvg(open).reverse();
    const cma = movingAvg(close).reverse();

    const difs = oma.map((_, i) => {
      return _ - cma[i];
    });

    if (upsFunc(difs)) {
      ups.push(s);
      if (upBuysFunc(orv, crv, oma, cma)) {
        upBuys.push(s);
      }
      if (upSellsFunc(orv, crv, oma, cma)) {
        upSells.push(s);
      }
    }
    if (downsFunc(difs)) {
      downs.push(s);
      if (downBuysFunc(orv, crv, oma, cma)) {
        downBuys.push(s);
      }
      if (downSellsFunc(orv, crv, oma, cma)) {
        downSells.push(s);
      }
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
    if (topsFunc(difs) || fuckingTopsFunc(difs)) {
      tops.push(s);
    }
    if (bottomsFunc(difs) || fuckingBottomsFunc(difs)) {
      bottoms.push(s);
    }
    if (fuckingTopsFunc(difs)) {
      fuckingTops.push(s);
    }
    if (fuckingBottomsFunc(difs)) {
      fuckingBottoms.push(s);
    }
  }

  return {
    ups,
    upBuys,
    upSells,
    downs,
    downBuys,
    downSells,
    fastUps,
    fastDowns,
    slowUps,
    slowDowns,
    tops,
    bottoms,
    fuckingTops,
    fuckingBottoms
  };
};

export const getEchartsOpt = (data, symbol) => {
  const upColor = '#00DA3C';
  const upBorderColor = '#008F28';
  const downColor = '#EC0000';
  const downBorderColor = '#8A0000';
  const oma7Color = '#FFD700';
  const cma7Color = '#FF00FF';

  const calculateMA = (values, dayCount = 7, open = false) => {
    const result = [];
    for (let i = 0, len = values.length; i < len; i++) {
      if (i < dayCount) {
        result.push('-');
        continue;
      }
      let sum = 0;
      for (let j = 0; j < dayCount; j++) {
        sum += Number(values[i - j][open ? 0 : 1]);
      }
      result.push(sum / dayCount);
    }
    return result;
  };

  const splitData = rawData => {
    const categoryData = [];
    const values = [];
    let oma7 = [];
    let cma7 = [];
    for (const d of rawData) {
      categoryData.push(new Date(d[0]).toLocaleDateString());
      values.push(d.slice(1));
    }

    oma7 = calculateMA(values, 7, true);
    cma7 = calculateMA(values);

    return {
      categoryData,
      values,
      oma7,
      cma7
    };
  };

  const optData = splitData(data);

  return {
    title: {
      text: symbol,
      link: `${config.binanceUrl.base}${symbol}${config.binanceUrl.query}`,
      textStyle: {
        fontSize: 12
      },
      top: '3%',
      left: '5%'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      formatter: function (params) {
        const k = params[0];
        const oma7 = params[1];
        const cma7 = params[2];

        const time = k.axisValue;
        const open = Number(k.data[1]);
        const close = Number(k.data[2]);
        const low = Number(k.data[3]);
        const high = Number(k.data[4]);
        const change = `${(((close - open) / open) * 100).toFixed(2)} %`;
        const amplitude = `${(((high - low) / low) * 100).toFixed(2)} %`;
        const oma = oma7.data === '-' ? oma7.data : oma7.data.toPrecision(open.toString().length - 1);
        const cma = cma7.data === '-' ? cma7.data : cma7.data.toPrecision(open.toString().length - 1);
        return `<div>${time}</div>
        <div><span style="color: ${k.color}">OPEN: </span>${open}</div>
        <div><span style="color: ${k.color}">CLOSE: </span>${close}</div>
        <div><span style="color: ${k.color}">LOW: </span>${low}</div>
        <div><span style="color: ${k.color}">HIGH: </span>${high}</div>
        <div><span style="color: ${k.color}">CHANGE: </span>${change}</div>
        <div><span style="color: ${k.color}">AMPLITUDE: </span>${amplitude}</div>
        <br />
        <div><span style="color: ${oma7.color}">OMA7: </span>${oma}</div>
        <div><span style="color: ${cma7.color}">CMA7: </span>${cma}</div>
        `;
      }
    },
    legend: {
      data: ['K', 'OMA7', 'CMA7'],
      top: '3%',
      right: '10%'
    },
    color: [oma7Color, cma7Color],
    grid: {
      top: '15%',
      left: '10%',
      right: '10%',
      bottom: '10%'
    },
    xAxis: {
      type: 'category',
      data: optData.categoryData,
      scale: true,
      boundaryGap: true,
      axisLine: { onZero: true },
      splitLine: { show: false },
      min: 'dataMin',
      max: 'dataMax'
    },
    yAxis: {
      scale: true,
      splitLine: { show: false },
      splitArea: {
        show: false
      }
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100
      }
    ],
    series: [
      {
        name: 'K',
        type: 'candlestick',
        data: optData.values,
        itemStyle: {
          color: upColor,
          color0: downColor,
          borderColor: upBorderColor,
          borderColor0: downBorderColor
        }
      },
      {
        name: 'OMA7',
        type: 'line',
        data: optData.oma7,
        showSymbol: false,
        lineStyle: {
          color: oma7Color
        }
      },
      {
        name: 'CMA7',
        type: 'line',
        data: optData.cma7,
        showSymbol: false,
        lineStyle: {
          color: cma7Color
        }
      }
    ]
  };
};
