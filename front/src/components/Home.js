import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MD5 from 'md5.js';
import styled from 'styled-components';
import {
  PlusOutlined,
  StarFilled,
  CloudSyncOutlined,
  CloudUploadOutlined,
  CloudDownloadOutlined
} from '@ant-design/icons';
import { Button, Divider, Input, Layout, Modal, Select, Tag, Typography } from 'antd';
import ReactECharts from 'echarts-for-react';
import config from '../config';
import { getBaseAsset, findNew, findPoint, getEcKlinesOpt, getEcVolsOpt, readFavorites, saveFavorites } from '../utils';

const { Footer } = Layout;
const { Option } = Select;
const { Link } = Typography;

const HomeMain = styled.div`
  .ant-layout-footer {
    margin-top: 100px;
    display: flex;
    justify-content: center;
  }

  .ant-divider-horizontal {
    margin: 0;
  }
`;

const HomeRow = styled.div`
  margin: 20px auto;
  max-width: 1280px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  .ant-tag {
    margin-bottom: 8px;
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

  const [searchSymbol, setSearchSymbol] = useState('');
  const [curType, setCurType] = useState('favs');
  const [curSymbol, setCurSymbol] = useState('');
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
    volRanking: '交易量排行'
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
    volRanking: alls
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(`${config.backend.base}${config.backend.klines}`);

      const news = findNew(data, 20);
      const {
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
      } = findPoint(data);

      const favs = readFavorites();

      const sortByVol = symbols => {
        return [...symbols].sort((s1, s2) => {
          const calcVol = s => {
            const d = data[s];
            const _ = d[d.length - 1];
            return Number(_[5]);
          };
          return calcVol(s2) - calcVol(s1);
        });
      };

      setAllData(data);
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
      setAlls(sortByVol(Object.keys(data)));
      setNews(sortByVol(news));
      setFavs(favs);

      const clientWidth = document.body.clientWidth;
      const ecKlinesHeight = clientWidth > 786 ? (clientWidth / 2 > 400 ? 400 : 400) : (clientWidth / 4) * 3;
      setEcKlinesHeight(ecKlinesHeight);

      const ecVolsHeight = clientWidth > 786 ? 600 : clientWidth;
      setEcKlinesHeight(ecVolsHeight);
    };
    fetchData();
  }, []);

  const changeCurType = _ => {
    setCurType(_);
    setCurSymbol('');

    if (_ === 'volRanking') {
      setEcVolsOpt(getEcVolsOpt(allData));
    }
  };

  const changeCurSymbol = _ => {
    setCurSymbol(_);
    setEcKlinesOpt(getEcKlinesOpt(allData[_], _));
  };

  const addFavs = () => {
    if (favs.includes(searchSymbol)) {
      return;
    }
    const _favs = [...favs, searchSymbol];
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
        <HomeRow>
          {Object.keys(types).map(_ => {
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
            <HomeRow>
              <HomeSelectSymbol>
                <Select showSearch placeholder="" onChange={_ => changeFav(_)}>
                  {alls.map(_ => (
                    <Option key={_} value={_}>
                      {_}
                    </Option>
                  ))}
                </Select>
                <Button
                  type="primary"
                  disabled={favs.includes(searchSymbol)}
                  icon={<PlusOutlined />}
                  onClick={() => addFavs()}
                />
                <Button type="primary" icon={<CloudSyncOutlined />} onClick={() => showFavsModal()} />
              </HomeSelectSymbol>
            </HomeRow>

            <HomeRow>
              {state[curType].map(_ => {
                return (
                  <div key={_}>
                    <Tag
                      color={curSymbol === _ ? '#177ddc' : ''}
                      closable
                      onClose={() => removeFavs(_)}
                      onClick={() => changeCurSymbol(_)}
                    >
                      {getBaseAsset(_)}
                    </Tag>
                  </div>
                );
              })}
            </HomeRow>
          </>
        ) : (
          curType !== 'volRanking' && (
            <HomeRow>
              {state[curType].map(_ => {
                return (
                  <div key={_}>
                    <Tag color={curSymbol === _ ? '#177ddc' : ''} onClick={() => changeCurSymbol(_)}>
                      {favs.includes(_) && <StarFilled />} {getBaseAsset(_)}
                    </Tag>
                  </div>
                );
              })}
            </HomeRow>
          )
        )}

        <Divider />

        <HomeRow>
          <HomeEcharts>
            {curSymbol && <ReactECharts theme="dark" style={{ height: `${ecKlinesHeight}px` }} option={ecKlinesOpt} />}
            {curType === 'volRanking' && (
              <ReactECharts theme="dark" style={{ height: `${ecVolsHeight}px` }} option={ecVolsOpt} />
            )}
          </HomeEcharts>
        </HomeRow>

        <Footer>
          <Link href="#/help">Help</Link>
        </Footer>
      </HomeMain>

      <Modal
        title=""
        footer={null}
        bodyStyle={{ padding: 20 }}
        width={240}
        closable={false}
        visible={showUpdateFavs}
        onCancel={() => setShowUpdateFavs(false)}
      >
        <HomeCloudFavsInput>
          <Input placeholder="key" value={favsKey} onChange={e => setFavsKey(e.target.value)} />
        </HomeCloudFavsInput>

        <HomeCloudFavsInput>{favsSuccessMsg && <Tag color="success">{favsSuccessMsg}</Tag>}</HomeCloudFavsInput>
        <HomeCloudFavsInput>{favsErrMsg && <Tag color="error">{favsErrMsg}</Tag>}</HomeCloudFavsInput>

        <HomeCloudFavsButton>
          <Button
            type="primary"
            disabled={!favsKey.length}
            icon={<CloudDownloadOutlined />}
            onClick={() => downloadFavs()}
          />
          <Button
            type="primary"
            danger
            disabled={!favsKey.length}
            icon={<CloudUploadOutlined />}
            onClick={() => uploadFavs()}
          />
        </HomeCloudFavsButton>
      </Modal>
    </Layout>
  );
}

export default App;
