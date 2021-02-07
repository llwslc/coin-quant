const env = process.env.REACT_APP_ENV;

const Config = {
  backend: '',
  localStorage: {
    favKey: 'favorites'
  }
};

const devConfig = {};
if (env === 'development') {
  devConfig.env = env;
  devConfig.backend = 'localhost:8080';
}

export default Object.assign(Config, devConfig);
