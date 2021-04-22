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
import { Button, Divider, Input, Layout, Modal, Select, Tag, Typography } from 'antd';
import ReactECharts from 'echarts-for-react';
import config from '../config';
import {
  getBaseAsset,
  findNew,
  findPoint,
  getEcKlinesOpt,
  getEcVolsOpt,
  readFavorites,
  saveFavorites,
  findTD9
} from '../utils';
import Footer from './Footer';

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
  margin: 10px auto;
  max-width: 1280px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  margin-top: ${props => (props.mt !== undefined ? `${props.mt}px` : '10px')};
  margin-bottom: ${props => (props.mb !== undefined ? `${props.mb}px` : '10px')};

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
  margin: 10px 20% 0;
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
  const [td9Msg, setTd9Msg] = useState('');

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
    binance,
    coinbase,
    volRanking: alls
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
  const trendTypes = [
    'favs',
    'ups',
    'downs',
    'fastUps',
    'fastDowns',
    'slowUps',
    'slowDowns',
    'alls',
    'news',
    'volRanking'
  ];
  const zoneTypes = ['binance', 'coinbase'];

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(`${config.backend.base}${config.backend.klines}`);

      const { klines = [] } = data;

      const symbols = Object.keys(klines);
      for (let i = 0; i < 3; i++) {
        // for (let i = 0; i < symbols.length; i++) {
        const _ = symbols[i];
        const { topPoints, confirmTopPoints, bottomPoints, confirmBottomPoints } = await findTD9(klines[_], _);

        const formatDate = points => {
          return points.map(p => {
            const date = new Date(p.openTime);
            return `${date.getMonth() + 1}/${date.getDate()}`;
          });
        };
      }
    };
    fetchData();
  }, []);

  const changeCurType = _ => {};

  const changeCurSymbol = _ => {};

  const changePreSymbol = () => {};

  const changeNxtSymbol = () => {};

  const addFavs = _ => {};

  const changeFav = _ => {};

  const removeFavs = _ => {};

  const showFavsModal = () => {};

  const downloadFavs = async () => {};

  const uploadFavs = async () => {};

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

        <HomeRow>
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
              {curSymbol && (
                <Tag onClick={() => addFavs(curSymbol)}>
                  {favs.includes(curSymbol) ? <StarFilled /> : <StarOutlined />}
                </Tag>
              )}
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

        {td9Msg && <HomeRow>{td9Msg}</HomeRow>}

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
            {curType === 'volRanking' && (
              <ReactECharts theme="dark" style={{ height: `${ecVolsHeight}px` }} option={ecVolsOpt} />
            )}
          </HomeEcharts>
        </HomeRow>

        <Footer />
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
