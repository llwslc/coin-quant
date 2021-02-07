const env = process.env.REACT_APP_ENV;

const Config = {
  backend: '/api/klines',
  localStorage: {
    favKey: 'favorites'
  },
  binanceUrl: {
    base: 'https://www.binance.com/zh-CN/trade/',
    query: '?layout=pro'
  }
};

const devConfig = {};
if (env === 'development') {
  devConfig.env = env;
  devConfig.backend = 'http://localhost:8080/api/klines';
}

export default Object.assign(Config, devConfig);
