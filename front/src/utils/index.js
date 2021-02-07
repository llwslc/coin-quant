import Config from '../config';

export const readFavorites = () => {
  try {
    const favs = window.localStorage.getItem(Config.localStorage.favKey);
    return JSON.parse(favs) || [];
  } catch (error) {
    return [];
  }
};

export const saveFavorites = symbols => {
  window.localStorage.setItem(Config.localStorage.favKey, JSON.stringify(symbols));
};
