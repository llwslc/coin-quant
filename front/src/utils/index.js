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

  const symbols = Object.keys(data);
  for (const s of symbols) {
    const d = data[s];
    const open = [];
    const close = [];
    for (const _ of d) {
      open.push(_[1]);
      close.push(_[2]);
    }
    const o = movingAvg(open).reverse();
    const c = movingAvg(close).reverse();

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

  return { ups, downs, fastUps, fastDowns, slowUps, slowDowns, tops, bottoms, fuckingTops, fuckingBottoms };
};

export const getEchartsOpt = (data, symbol) => {
  const upColor = '#00DA3C';
  const upBorderColor = '#008F28';
  const downColor = '#EC0000';
  const downBorderColor = '#8A0000';
  const oma7Color = '#FFD700';
  const cma7Color = '#FF00FF';

  const splitData = rawData => {
    const categoryData = [];
    const values = [];
    for (const d of rawData) {
      categoryData.push(new Date(d[0]).toLocaleDateString());
      values.push(d.slice(1));
    }
    return {
      categoryData,
      values
    };
  };

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

  const optData = splitData(data);

  return {
    title: {
      text: symbol,
      link: `${config.binanceUrl.base}${symbol}${config.binanceUrl.query}`,
      top: '3%',
      left: '5%'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['K', 'OMA7', 'CMA7'],
      top: '3%'
    },
    grid: {
      top: '15%',
      left: '10%',
      right: '10%',
      bottom: '20%'
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
      },
      {
        show: true,
        type: 'slider',
        top: '87%',
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
        data: calculateMA(optData.values, 7, true),
        showSymbol: false,
        lineStyle: {
          color: oma7Color
        }
      },
      {
        name: 'CMA7',
        type: 'line',
        data: calculateMA(optData.values, 7),
        showSymbol: false,
        lineStyle: {
          color: cma7Color
        }
      }
    ]
  };
};
