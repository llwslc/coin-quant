import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MD5 from 'md5.js';
import styled from 'styled-components';
import {
  PlusOutlined,
  StarFilled,
  StarOutlined,
  StopOutlined,
  CloudSyncOutlined,
  CloudUploadOutlined,
  CloudDownloadOutlined,
  StepBackwardOutlined,
  StepForwardOutlined
} from '@ant-design/icons';
import { Button, Divider, Input, Layout, Modal, Select, Tag } from 'antd';
import ReactECharts from 'echarts-for-react';
import config from '../config';
import { getBaseAsset, findNew, findPoint, getEcKlinesOpt, getEcVolsOpt, readFavorites, saveFavorites, findTD9 } from '../utils';

import Footer from './Footer';

const { Option } = Select;

const HomeMain = styled.div`
  .ant-divider-horizontal {
    margin: 0;
  }
`;

const HomeRow = styled.div`
  margin: 8px auto;
  max-width: 1280px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  margin-top: ${props => (props.mt !== undefined ? `${props.mt}px` : '8px')};
  margin-bottom: ${props => (props.mb !== undefined ? `${props.mb}px` : '8px')};

  .ant-tag {
    margin-bottom: 8px;
  }

  &.green {
    span {
      color: SpringGreen;
    }
  }

  &.red {
    span {
      color: OrangeRed;
    }
  }
`;

const HomeSymbolTypes = styled.div`
  width: 100%;
  margin: 0 20%;
  display: flex;
  justify-content: space-between;

  div {
    display: flex;
    flex-wrap: wrap;
  }

  div:nth-child(1) {
    display: block;
    width: 30%;
  }

  @media (max-width: 768px) {
    margin: 10px 5% 0;
  }
`;

const HomeTd9Types = styled.div`
  display: flex;
  span {
    margin-right: 8px;
  }
  .ant-tag {
    margin-bottom: 0;
  }
`;

const HomeSelectSymbol = styled.div`
  .ant-select {
    min-width: 200px;
  }
  .ant-btn {
    margin-left: 20px;
  }
`;

const HomeEcharts = styled.div`
  width: 100%;
`;

const HomeCloudFavsInput = styled.div`
  display: flex;
  justify-content: normal;

  .ant-tag {
    margin-top: 10px;
    white-space: pre-wrap;
  }
`;

const HomeCloudFavsButton = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;

  .ant-btn {
    width: 45%;
  }
`;

function App() {
  const [allData, setAllData] = useState([]);
  const [coinsInfo, setCoinInfo] = useState([]);

  const [favs, setFavs] = useState([]);
  const [alls, setAlls] = useState([]);
  const [news, setNews] = useState([]);
  const [ups, setUps] = useState([]);
  const [upBuys, setUpBuys] = useState([]);
  const [upSells, setUpSells] = useState([]);
  const [downs, setDowns] = useState([]);
  const [downBuys, setDownBuys] = useState([]);
  const [downSells, setDownSells] = useState([]);
  const [fastUps, setFastUps] = useState([]);
  const [fastDowns, setFastDowns] = useState([]);
  const [slowUps, setSlowUps] = useState([]);
  const [slowDowns, setSlowDowns] = useState([]);
  const [tops, setTops] = useState([]);
  const [bottoms, setBottoms] = useState([]);
  const [fuckingTops, setFuckingTops] = useState([]);
  const [fuckingBottoms, setFuckingBottoms] = useState([]);

  const [binance, setBinance] = useState([]);
  const [coinbase, setCoinbase] = useState([]);

  const [searchSymbol, setSearchSymbol] = useState('');
  const [curType, setCurType] = useState('favs');
  const [curSymbol, setCurSymbol] = useState('');
  const [symbolTypes, setSymbolTypes] = useState([]);
  const [curSymbolInfo, setCurSymbolInfo] = useState({});
  const [td9Exist, setTd9Exist] = useState(false);
  const [td9Tops, setTd9Tops] = useState([]);
  const [td9FuckingTops, setTd9FuckingTops] = useState([]);
  const [td9Bottoms, setTd9Bottoms] = useState([]);
  const [td9FuckingBottoms, setTd9FuckingBottoms] = useState([]);

  const [ecKlinesOpt, setEcKlinesOpt] = useState({});
  const [ecVolsOpt, setEcVolsOpt] = useState({});

  const [ecKlinesHeight, setEcKlinesHeight] = useState(300);
  const [ecVolsHeight, setEcVolsHeight] = useState(600);
  const [showUpdateFavs, setShowUpdateFavs] = useState(false);
  const [favsKey, setFavsKey] = useState('');
  const [favsSuccessMsg, setFavsSuccessMsg] = useState('');
  const [favsErrMsg, setFavsErrMsg] = useState('');

  const types = {
    favs: '自选',
    upBuys: '上涨买点',
    downBuys: '下跌买点',
    upSells: '上涨卖点',
    downSells: '下跌卖点',
    tops: '处于顶部',
    bottoms: '处于底部',
    fuckingTops: '确认顶部',
    fuckingBottoms: '确认底部',
    ups: '持续上涨',
    downs: '持续下跌',
    fastUps: '暴力上涨',
    fastDowns: '暴力下跌',
    slowUps: '微弱上涨',
    slowDowns: '微弱下跌',
    alls: '全部',
    news: '新币',
    binance: 'BINANCE',
    coinbase: 'COINBASE',
    volRanking: '交易量排行',
    td9Tops: '顶',
    td9FuckingTops: '大顶',
    td9Bottoms: '底',
    td9FuckingBottoms: '大底'
  };
  const state = {
    favs,
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
    fuckingBottoms,
    alls,
    news,
    binance,
    coinbase,
    volRanking: alls,

    td9Tops,
    td9FuckingTops,
    td9Bottoms,
    td9FuckingBottoms
  };
  const findTypes = [
    'upBuys',
    'downBuys',
    'upSells',
    'downSells',
    'tops',
    'bottoms',
    'fuckingTops',
    'fuckingBottoms',
    'ups',
    'downs',
    'fastUps',
    'fastDowns',
    'slowUps',
    'slowDowns',
    'alls',
    'news',
    'binance',
    'coinbase'
  ];
  const buyTypes = ['upBuys', 'downBuys', 'bottoms', 'fuckingBottoms'];
  const sellTypes = ['upSells', 'downSells', 'tops', 'fuckingTops'];
  const trendTypes = ['favs', 'ups', 'downs', 'fastUps', 'fastDowns', 'slowUps', 'slowDowns', 'alls', 'news', 'volRanking'];
  const zoneTypes = ['binance', 'coinbase'];
  const td9Types = ['td9Tops', 'td9FuckingTops', 'td9Bottoms', 'td9FuckingBottoms'];

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(`${config.backend.base}${config.backend.klines}`);

      const { klines = [], coins = [] } = data;
      const news = findNew(klines, 20);
      const { ups, upBuys, upSells, downs, downBuys, downSells, fastUps, fastDowns, slowUps, slowDowns, tops, bottoms, fuckingTops, fuckingBottoms } =
        findPoint(klines);

      const favs = readFavorites();

      const sortByVol = symbols => {
        return [...symbols].sort((s1, s2) => {
          const calcVol = s => {
            const d = klines[s] ? klines[s] : [[0, 0, 0, 0, 0, 0]];
            const _ = d[d.length - 1];
            return Number(_[5]);
          };
          return calcVol(s2) - calcVol(s1);
        });
      };

      setAllData(klines);
      setCoinInfo(coins);
      setUps(sortByVol(ups));
      setUpBuys(sortByVol(upBuys));
      setUpSells(sortByVol(upSells));
      setDowns(sortByVol(downs));
      setDownBuys(sortByVol(downBuys));
      setDownSells(sortByVol(downSells));
      setFastUps(sortByVol(fastUps));
      setFastDowns(sortByVol(fastDowns));
      setSlowUps(sortByVol(slowUps));
      setSlowDowns(sortByVol(slowDowns));
      setTops(sortByVol(tops));
      setBottoms(sortByVol(bottoms));
      setFuckingTops(sortByVol(fuckingTops));
      setFuckingBottoms(sortByVol(fuckingBottoms));
      setAlls(sortByVol(Object.keys(klines)));
      setNews(sortByVol(news));
      setFavs(favs);

      const findZone = symbols => {
        const all = Object.keys(klines);
        return symbols.map(s => {
          const res = all.filter(_ => _.indexOf(s) === 0);
          return res.length ? res[0] : s;
        });
      };

      setBinance(sortByVol(findZone(config.zones.binance)));
      setCoinbase(sortByVol(findZone(config.zones.coinbase)));

      const clientWidth = document.body.clientWidth;
      const ecKlinesHeight = clientWidth > 786 ? (clientWidth / 2 > 400 ? 400 : 400) : clientWidth;
      setEcKlinesHeight(ecKlinesHeight);

      const ecVolsHeight = clientWidth > 786 ? 600 : clientWidth;
      setEcVolsHeight(ecVolsHeight);
    };
    fetchData();
  }, []);

  const initTd9 = () => {
    setTd9Exist(false);
    setTd9Tops([]);
    setTd9FuckingTops([]);
    setTd9Bottoms([]);
    setTd9FuckingBottoms([]);
  };

  const changeCurType = _ => {
    setCurType(_);
    setCurSymbol('');
    initTd9();
    setSymbolTypes([]);

    if (_ === 'volRanking') {
      setEcVolsOpt(getEcVolsOpt(allData));
    }
  };

  const changeCurSymbol = _ => {
    setCurSymbol(_);
    if (!allData[_]) return;

    setEcKlinesOpt(getEcKlinesOpt(allData[_], _));
    initTd9();

    setTimeout(async () => {
      const { topPoints, confirmTopPoints, bottomPoints, confirmBottomPoints } = await findTD9(allData[_], _);

      const formatDate = points => {
        return points.map(p => {
          const date = new Date(p.openTime);
          return `${date.getMonth() + 1}/${date.getDate()}`;
        });
      };

      if (topPoints.length || confirmTopPoints.length || bottomPoints.length || confirmBottomPoints.length) {
        setTd9Exist(true);
        setTd9Tops(formatDate(topPoints));
        setTd9FuckingTops(formatDate(confirmTopPoints));
        setTd9Bottoms(formatDate(bottomPoints));
        setTd9FuckingBottoms(formatDate(confirmBottomPoints));
      } else {
        initTd9();
      }
    }, 0);

    setCurSymbolInfo({});
    for (const coin of coinsInfo) {
      if (coin.title.includes(`(${getBaseAsset(_)})`) || coin.title.includes(`（${getBaseAsset(_)}）`)) {
        setCurSymbolInfo({
          ...coin,
          href: `${config.researchUrl.base}${coin.href}`
        });
      }
    }

    const symbolTypes = [];
    for (const t of findTypes) {
      const symbols = state[t];
      for (const s of symbols) {
        if (s === _) {
          symbolTypes.push(t);
          break;
        }
      }
    }
    setSymbolTypes(symbolTypes);
  };

  const changePreSymbol = () => {
    const curSymbols = state[curType];
    const idx = curSymbols.indexOf(curSymbol);
    const preSymbol = curSymbols[idx > 0 ? idx - 1 : 0];
    if (preSymbol !== curSymbol) {
      changeCurSymbol(preSymbol);
    }
  };

  const changeNxtSymbol = () => {
    const curSymbols = state[curType];
    const idx = curSymbols.indexOf(curSymbol);
    const nxtSymbol = curSymbols[idx < curSymbols.length - 1 ? idx + 1 : curSymbols.length - 1];
    if (nxtSymbol !== curSymbol) {
      changeCurSymbol(nxtSymbol);
    }
  };

  const addFavs = _ => {
    const _symbol = _ ? _ : searchSymbol;

    if (favs.includes(_symbol)) {
      return;
    }
    const _favs = [...favs, _symbol];
    setFavs(_favs);
    saveFavorites(_favs);
  };

  const changeFav = _ => {
    setSearchSymbol(_);
    changeCurSymbol(_);
  };

  const removeFavs = _ => {
    const idx = favs.indexOf(_);
    if (idx > -1) {
      const _favs = [...favs];
      _favs.splice(idx, 1);
      setFavs(_favs);
      saveFavorites(_favs);
    }
  };

  const showFavsModal = () => {
    setFavsKey('');
    setFavsSuccessMsg('');
    setFavsErrMsg('');
    setShowUpdateFavs(true);
  };

  const downloadFavs = async () => {
    try {
      const { data } = await axios.get(`${config.backend.base}${config.backend.favs}`, {
        params: {
          name: new MD5().update(favsKey).digest('hex')
        }
      });
      if (data.length) {
        saveFavorites(data);
        setFavs(data);

        setFavsSuccessMsg('Success');
        setFavsErrMsg('');
      } else {
        setFavsSuccessMsg('');
        setFavsErrMsg('Name does not exist');
      }
    } catch (error) {
      setFavsErrMsg(error.message ? error.message : error);
    }
  };

  const uploadFavs = async () => {
    try {
      await axios.post(`${config.backend.base}${config.backend.favs}`, {
        name: new MD5().update(favsKey).digest('hex'),
        favs
      });
      setFavsSuccessMsg('Success');
      setFavsErrMsg('');
    } catch (error) {
      setFavsErrMsg(error.message ? error.message : error);
    }
  };

  return (
    <Layout>
      <HomeMain>
        <HomeRow mb={0}>
          {trendTypes.map(_ => {
            return (
              <div key={_}>
                <Button type={curType === _ ? 'primary' : 'link'} onClick={() => changeCurType(_)}>
                  {types[_]}({state[_].length})
                </Button>
              </div>
            );
          })}
        </HomeRow>
        <HomeRow mt={0} mb={0} className={'green'}>
          {buyTypes.map(_ => {
            return (
              <div key={_}>
                <Button type={curType === _ ? 'primary' : 'link'} onClick={() => changeCurType(_)}>
                  {types[_]}({state[_].length})
                </Button>
              </div>
            );
          })}
        </HomeRow>
        <HomeRow mt={0} mb={0} className={'red'}>
          {sellTypes.map(_ => {
            return (
              <div key={_}>
                <Button type={curType === _ ? 'primary' : 'link'} onClick={() => changeCurType(_)}>
                  {types[_]}({state[_].length})
                </Button>
              </div>
            );
          })}
        </HomeRow>
        <HomeRow mt={0}>
          {zoneTypes.map(_ => {
            return (
              <div key={_}>
                <Button type={curType === _ ? 'primary' : 'link'} onClick={() => changeCurType(_)}>
                  {types[_]}({state[_].length})
                </Button>
              </div>
            );
          })}
        </HomeRow>

        <Divider />

        {curType === 'favs' ? (
          <>
            <HomeRow mb={0}>
              <HomeSelectSymbol>
                <Select showSearch placeholder="" onChange={_ => changeFav(_)}>
                  {alls.map(_ => (
                    <Option key={_} value={_}>
                      {_}
                    </Option>
                  ))}
                </Select>
                <Button type="primary" disabled={favs.includes(searchSymbol)} icon={<PlusOutlined />} onClick={() => addFavs()} />
                <Button type="primary" icon={<CloudSyncOutlined />} onClick={() => showFavsModal()} />
              </HomeSelectSymbol>
            </HomeRow>

            <HomeRow mb={0}>
              {state[curType].map(_ => {
                return (
                  <div key={_}>
                    <Tag color={curSymbol === _ ? '#177ddc' : ''} closable onClose={() => removeFavs(_)} onClick={() => changeCurSymbol(_)}>
                      {getBaseAsset(_)}
                    </Tag>
                  </div>
                );
              })}
            </HomeRow>
          </>
        ) : (
          curType !== 'volRanking' && (
            <HomeRow mb={0}>
              {state[curType].map(_ => {
                return (
                  <div key={_}>
                    <Tag color={curSymbol === _ ? '#177ddc' : ''} onClick={() => changeCurSymbol(_)}>
                      {favs.includes(_) && <StarFilled />}
                      {!allData[_] && <StopOutlined />} {getBaseAsset(_)}
                    </Tag>
                  </div>
                );
              })}
            </HomeRow>
          )
        )}

        <Divider />

        <HomeRow mb={0}>
          <HomeSymbolTypes>
            <div>
              {state[curType].length > 0 && curSymbol && (
                <>
                  <Tag onClick={() => changePreSymbol()}>
                    <StepBackwardOutlined />
                  </Tag>
                  <Tag onClick={() => changeNxtSymbol()}>
                    <StepForwardOutlined />
                  </Tag>
                </>
              )}
            </div>
            <div>
              {curSymbol && <Tag onClick={() => addFavs(curSymbol)}>{favs.includes(curSymbol) ? <StarFilled /> : <StarOutlined />}</Tag>}
              {symbolTypes.map(_ => {
                return (
                  <div key={_}>
                    <Tag color={curType === _ ? '#177ddc' : ''} onClick={() => setCurType(_)}>
                      {types[_]}
                    </Tag>
                  </div>
                );
              })}
            </div>
          </HomeSymbolTypes>
        </HomeRow>

        {td9Exist && (
          <HomeRow mt={0}>
            <HomeTd9Types>
              <span>TD9:</span>
              {td9Types.map(_ => {
                return (
                  <div key={_}>
                    {state[_].length ? (
                      <>
                        <span>{types[_]}</span>
                        {state[_].map(p => {
                          return <Tag key={p}>{p}</Tag>;
                        })}
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                );
              })}
            </HomeTd9Types>
          </HomeRow>
        )}

        {curSymbol && (
          <HomeRow mt={0} mb={0}>
            <span>
              <a href={curSymbolInfo.href} target="_blank" rel="noreferrer">
                {curSymbolInfo.title}
              </a>{' '}
              {curSymbolInfo.description}
            </span>
          </HomeRow>
        )}

        <HomeRow>
          <HomeEcharts>
            {curSymbol && <ReactECharts theme="dark" style={{ height: `${ecKlinesHeight}px` }} option={ecKlinesOpt} />}
            {curType === 'volRanking' && <ReactECharts theme="dark" style={{ height: `${ecVolsHeight}px` }} option={ecVolsOpt} />}
          </HomeEcharts>
        </HomeRow>

        <Footer />
      </HomeMain>

      <Modal title="" footer={null} bodyStyle={{ padding: 20 }} width={240} closable={false} visible={showUpdateFavs} onCancel={() => setShowUpdateFavs(false)}>
        <HomeCloudFavsInput>
          <Input placeholder="key" value={favsKey} onChange={e => setFavsKey(e.target.value)} />
        </HomeCloudFavsInput>

        <HomeCloudFavsInput>{favsSuccessMsg && <Tag color="success">{favsSuccessMsg}</Tag>}</HomeCloudFavsInput>
        <HomeCloudFavsInput>{favsErrMsg && <Tag color="error">{favsErrMsg}</Tag>}</HomeCloudFavsInput>

        <HomeCloudFavsButton>
          <Button type="primary" disabled={!favsKey.length} icon={<CloudDownloadOutlined />} onClick={() => downloadFavs()} />
          <Button type="primary" danger disabled={!favsKey.length} icon={<CloudUploadOutlined />} onClick={() => uploadFavs()} />
        </HomeCloudFavsButton>
      </Modal>
    </Layout>
  );
}

export default App;
