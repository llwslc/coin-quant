import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { PlusOutlined, StarFilled } from '@ant-design/icons';
import { Button, Divider, Layout, Select, Tag, Typography } from 'antd';
import ReactECharts from 'echarts-for-react';
import config from '../config';
import { findNew, findPoint, getEchartsOpt, readFavorites, saveFavorites } from '../utils';

const { Footer } = Layout;
const { Option } = Select;
const { Link } = Typography;

const HomeMain = styled.div`
  .ant-layout-footer {
    margin-top: 100px;
    display: flex;
    justify-content: center;
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
  const [echartsOpt, setEchartsOpt] = useState({});

  const [echartsHeight, setEchartsHeight] = useState(300);

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
    news: '新币'
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
    news
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(config.backend);

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
            return Number(_[1]) * Number(_[5]);
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
      const echartsHeight = clientWidth > 786 ? (clientWidth / 2 > 400 ? 400 : 400) : (clientWidth / 4) * 3;
      setEchartsHeight(echartsHeight);
    };
    fetchData();
  }, []);

  const changeCurType = _ => {
    setCurType(_);
    setCurSymbol('');
  };

  const changeCurSymbol = _ => {
    setCurSymbol(_);
    setEchartsOpt(getEchartsOpt(allData[_], _));
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

  const getName = _ => {
    const fait1 = 'USDT';
    const fait2 = 'BUSD';
    if (_.split(fait1).length > 1) {
      return _.split(fait1)[0];
    }
    if (_.split(fait2).length > 1) {
      return _.split(fait2)[0];
    }

    return _;
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
              </HomeSelectSymbol>
            </HomeRow>

            <HomeRow>
              {state[curType].map(_ => {
                return (
                  <div key={_}>
                    <Tag closable onClose={() => removeFavs(_)} onClick={() => changeCurSymbol(_)}>
                      {getName(_)}
                    </Tag>
                  </div>
                );
              })}
            </HomeRow>
          </>
        ) : (
          <HomeRow>
            {state[curType].map(_ => {
              return (
                <div key={_}>
                  <Tag color={curSymbol === _ ? '#177ddc' : ''} onClick={() => changeCurSymbol(_)}>
                    {favs.includes(_) && <StarFilled />} {getName(_)}
                  </Tag>
                </div>
              );
            })}
          </HomeRow>
        )}

        <Divider />

        {curSymbol && (
          <HomeRow>
            <HomeEcharts>
              <ReactECharts theme="dark" style={{ height: `${echartsHeight}px` }} option={echartsOpt} />
            </HomeEcharts>
          </HomeRow>
        )}

        <Footer>
          <Link href="#/help">Help</Link>
        </Footer>
      </HomeMain>
    </Layout>
  );
}

export default App;
