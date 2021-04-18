import zones from './zones';
const env = process.env.REACT_APP_ENV;

const Config = {
  backend: {
    base: '/',
    klines: 'api/klines',
    price: 'api/price',
    favs: 'api/favs'
  },
  localStorage: {
    favKey: 'favorites'
  },
  binanceUrl: {
    base: 'https://www.binance.com/zh-CN/trade/',
    query: '?layout=pro'
  },
  researchUrl: {
    base: 'https://research.binance.com/cn'
  },
  zones
};

const devConfig = {};
if (env === 'development') {
  devConfig.env = env;
  devConfig.backend = {
    base: 'http://localhost:8888/',
    klines: 'api/klines',
    price: 'api/price',
    favs: 'api/favs'
  };
}

export default Object.assign(Config, devConfig);
