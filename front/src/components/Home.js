import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Button, Divider, Layout, Typography } from 'antd';
import ReactECharts from 'echarts-for-react';
import config from '../config';
import { findNew, findPoint, getEchartsOpt } from '../utils';

const { Footer } = Layout;
const { Link } = Typography;

const _Home = styled.div`
  .ant-layout-footer {
    margin-top: 100px;
    display: flex;
    justify-content: center;
  }
`;

const _Row = styled.div`
  margin: 20px auto;
  max-width: 1280px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;

const _Echarts = styled.div`
  width: 100%;
`;

function App() {
  const [allData, setAllData] = useState([]);
  const [alls, setAlls] = useState([]);
  const [news, setNews] = useState([]);
  const [ups, setUps] = useState([]);
  const [downs, setDowns] = useState([]);
  const [fastUps, setFastUps] = useState([]);
  const [fastDowns, setFastDowns] = useState([]);
  const [slowUps, setSlowUps] = useState([]);
  const [slowDowns, setSlowDowns] = useState([]);
  const [tops, setTops] = useState([]);
  const [bottoms, setBottoms] = useState([]);
  const [fuckingTops, setFuckingTops] = useState([]);
  const [fuckingBottoms, setFuckingBottoms] = useState([]);

  const [curType, setCurType] = useState('alls');
  const [curSymbol, setCurSymbol] = useState('');
  const [echartsOpt, setEchartsOpt] = useState({});

  const types = {
    alls: '全部',
    news: '新币',
    ups: '持续上涨',
    downs: '持续下跌',
    fastUps: '暴力上涨',
    fastDowns: '暴力下跌',
    slowUps: '微弱上涨',
    slowDowns: '微弱下跌',
    tops: '处于顶部',
    bottoms: '处于底部',
    fuckingTops: '确认顶部',
    fuckingBottoms: '确认底部'
  };
  const state = {
    alls,
    news,
    ups,
    downs,
    fastUps,
    fastDowns,
    slowUps,
    slowDowns,
    tops,
    bottoms,
    fuckingTops,
    fuckingBottoms
  };

  useEffect(async () => {
    const { data } = await axios.get(config.backend);

    const news = findNew(data, 20);
    const {
      ups,
      downs,
      fastUps,
      fastDowns,
      slowUps,
      slowDowns,
      tops,
      bottoms,
      fuckingTops,
      fuckingBottoms
    } = findPoint(data);

    setAllData(data);
    setAlls(Object.keys(data));
    setNews(news);
    setUps(ups);
    setDowns(downs);
    setFastUps(fastUps);
    setFastDowns(fastDowns);
    setSlowUps(slowUps);
    setSlowDowns(slowDowns);
    setTops(tops);
    setBottoms(bottoms);
    setFuckingTops(fuckingTops);
    setFuckingBottoms(fuckingBottoms);
  }, []);

  const changeCurType = _ => {
    setCurType(_);
    setCurSymbol('');
  };

  const changeCurSymbol = _ => {
    setCurSymbol(_);
    setEchartsOpt(getEchartsOpt(allData[_], _));
  };

  return (
    <Layout>
      <_Home>
        <_Row>
          {Object.keys(types).map(_ => {
            return (
              <div key={_}>
                <Button type={curType === _ ? 'primary' : 'link'} onClick={() => changeCurType(_)}>
                  {types[_]}({state[_].length})
                </Button>
              </div>
            );
          })}
        </_Row>

        <Divider />

        <_Row>
          {state[curType].map(_ => {
            return (
              <div key={_}>
                <Button type={curSymbol === _ ? 'primary' : 'link'} onClick={() => changeCurSymbol(_)}>
                  {_}
                </Button>
              </div>
            );
          })}
        </_Row>

        <Divider />

        {curSymbol && (
          <_Row>
            <_Echarts>
              <ReactECharts theme="dark" option={echartsOpt} />
            </_Echarts>
          </_Row>
        )}

        <Footer>
          <Link href="#/help">Help</Link>
        </Footer>
      </_Home>
    </Layout>
  );
}

export default App;
