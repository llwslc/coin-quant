// 简化版 OKX TradingView Datafeed (只支持历史数据，不使用 WebSocket)
const OKX_REST_API = 'https://www.okx.com/api/v5/market/candles';

class SimpleOKXDatafeed {
  constructor() {
    this.supportedResolutions = ['1', '3', '5', '15', '30', '60', '120', '240', '360', '720', '1D', '3D', '1W', '1M'];
    this.config = {
      supported_resolutions: this.supportedResolutions,
      exchanges: [
        {
          value: 'OKX',
          name: 'OKX',
          desc: 'OKX Exchange'
        }
      ],
      symbols_types: [
        {
          name: 'crypto',
          value: 'crypto'
        }
      ]
    };
  }

  onReady(callback) {
    console.log('[SimpleOKXDatafeed]: onReady called');
    setTimeout(() => callback(this.config), 0);
  }

  searchSymbols(userInput, exchange, symbolType, onResultReadyCallback) {
    console.log('[SimpleOKXDatafeed]: searchSymbols called');
    const symbols = ['BTC-USDT', 'ETH-USDT', 'BNB-USDT', 'ADA-USDT', 'SOL-USDT', 'DOT-USDT', 'DOGE-USDT', 'AVAX-USDT', 'SHIB-USDT', 'MATIC-USDT'];

    const filteredSymbols = symbols
      .filter(symbol => symbol.toLowerCase().includes(userInput.toLowerCase()))
      .map(symbol => ({
        symbol: symbol,
        full_name: `OKX:${symbol}`,
        description: symbol.replace('-', '/'),
        exchange: 'OKX',
        type: 'crypto'
      }));

    onResultReadyCallback(filteredSymbols);
  }

  resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
    console.log('[SimpleOKXDatafeed]: resolveSymbol called with', symbolName);

    const cleanSymbol = symbolName.replace('OKX:', '').replace('/', '-');

    const symbolInfo = {
      ticker: cleanSymbol,
      name: cleanSymbol,
      description: cleanSymbol.replace('-', '/'),
      type: 'crypto',
      session: '24x7',
      timezone: 'Etc/UTC',
      exchange: 'OKX',
      minmov: 1,
      pricescale: 100000000,
      has_intraday: true,
      has_weekly_and_monthly: true,
      supported_resolutions: this.supportedResolutions,
      volume_precision: 8,
      data_status: 'streaming',
      full_name: `OKX:${cleanSymbol}`
    };

    setTimeout(() => onSymbolResolvedCallback(symbolInfo), 0);
  }

  getBars(symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) {
    console.log('[SimpleOKXDatafeed]: getBars called', symbolInfo.ticker, resolution, periodParams);

    const { from, to, firstDataRequest } = periodParams;
    const symbol = symbolInfo.ticker;

    this.fetchBars(symbol, resolution, from, to, firstDataRequest)
      .then(bars => {
        console.log(`[SimpleOKXDatafeed]: Fetched ${bars.length} bars for ${symbol}`);
        if (bars.length === 0) {
          onHistoryCallback([], { noData: true });
        } else {
          onHistoryCallback(bars, { noData: false });
        }
      })
      .catch(error => {
        console.error('[SimpleOKXDatafeed]: Error fetching bars', error);
        onErrorCallback(error);
      });
  }

  async fetchBars(symbol, resolution, from, to, firstDataRequest) {
    try {
      const resolutionMap = {
        1: '1m',
        3: '3m',
        5: '5m',
        15: '15m',
        30: '30m',
        60: '1H',
        120: '2H',
        240: '4H',
        360: '6H',
        720: '12H',
        '1D': '1D',
        '3D': '3D',
        '1W': '1W',
        '1M': '1M'
      };

      const bar = resolutionMap[resolution] || '1m';
      const limit = firstDataRequest ? 300 : 100;

      // 处理时间范围 - 确保不请求未来时间
      const now = Math.floor(Date.now() / 1000);
      const actualTo = to ? Math.min(to, now) : now;
      const actualFrom = from || now - 30 * 24 * 60 * 60; // 默认30天前

      console.log('[SimpleOKXDatafeed]: Original time range - from:', new Date(from * 1000), 'to:', new Date(to * 1000));
      console.log('[SimpleOKXDatafeed]: Adjusted time range - from:', new Date(actualFrom * 1000), 'to:', new Date(actualTo * 1000));

      // 先尝试简单请求，不使用时间范围
      let url = `${OKX_REST_API}?instId=${symbol}&bar=${bar}&limit=${limit}`;
      console.log('[SimpleOKXDatafeed]: Simple test URL:', url);

      let response = await fetch(url);
      let data = await response.json();

      console.log('[SimpleOKXDatafeed]: Simple request response:', data);

      // 如果简单请求成功，直接返回结果
      if (data.code === '0' && data.data && data.data.length > 0) {
        console.log('[SimpleOKXDatafeed]: Simple request successful');
      } else {
        console.log('[SimpleOKXDatafeed]: Simple request failed, trying with time parameters...');

        // 尝试带时间参数的请求
        url = `${OKX_REST_API}?instId=${symbol}&bar=${bar}&limit=${limit}&before=${actualTo * 1000}`;
        console.log('[SimpleOKXDatafeed]: Time-based URL:', url);

        response = await fetch(url);
        data = await response.json();

        console.log('[SimpleOKXDatafeed]: Time-based request response:', data);
      }

      if (data.code !== '0') {
        console.error('[SimpleOKXDatafeed]: API error code:', data.code, 'msg:', data.msg);
        return [];
      }

      if (!data.data || data.data.length === 0) {
        console.warn('[SimpleOKXDatafeed]: No data returned from API');
        return [];
      }

      console.log('[SimpleOKXDatafeed]: Raw data count:', data.data.length);
      console.log('[SimpleOKXDatafeed]: Raw data sample:', data.data[0]);

      const bars = data.data.reverse().map(item => ({
        time: parseInt(item[0]),
        open: parseFloat(item[1]),
        high: parseFloat(item[2]),
        low: parseFloat(item[3]),
        close: parseFloat(item[4]),
        volume: parseFloat(item[5])
      }));

      console.log('[SimpleOKXDatafeed]: Processed bars count:', bars.length);
      if (bars.length > 0) {
        console.log('[SimpleOKXDatafeed]: First processed bar:', bars[0]);
        console.log('[SimpleOKXDatafeed]: Last processed bar:', bars[bars.length - 1]);
      }

      return bars;
    } catch (error) {
      console.error('[SimpleOKXDatafeed]: Fetch error', error);
      throw error;
    }
  }

  // 简化版本不支持实时数据
  subscribeBars() {
    console.log('[SimpleOKXDatafeed]: subscribeBars called (not implemented)');
  }

  unsubscribeBars() {
    console.log('[SimpleOKXDatafeed]: unsubscribeBars called (not implemented)');
  }
}

const simpleOkxDatafeed = new SimpleOKXDatafeed();

// 在浏览器中添加全局测试函数
if (typeof window !== 'undefined') {
  window.testSimpleOKXDatafeed = async function () {
    console.log('=== Testing SimpleOKXDatafeed ===');

    // 直接调用 fetchBars 方法
    try {
      const now = Math.floor(Date.now() / 1000);
      const oneWeekAgo = now - 7 * 24 * 60 * 60;

      console.log('Testing fetchBars with BTC-USDT, 1D resolution');
      const bars = await simpleOkxDatafeed.fetchBars('BTC-USDT', '1D', oneWeekAgo, now, true);
      console.log('Result bars:', bars);

      if (bars.length > 0) {
        console.log('✅ Successfully fetched', bars.length, 'bars');
        console.log('First bar:', bars[0]);
        console.log('Last bar:', bars[bars.length - 1]);
      } else {
        console.log('❌ No bars returned');
      }
    } catch (error) {
      console.error('❌ Error testing fetchBars:', error);
    }
  };

  console.log('Call testSimpleOKXDatafeed() in console to test the datafeed');
}

export default simpleOkxDatafeed;
