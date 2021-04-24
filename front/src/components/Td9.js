import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Divider, Layout, Spin, Tag, Typography } from 'antd';
import ReactECharts from 'echarts-for-react';
import config from '../config';
import { getBaseAsset, getEcKlinesOpt, findTD9 } from '../utils';
import Footer from './Footer';

const { Text } = Typography;

const Td9Main = styled.div`
  .ant-divider-horizontal {
    margin: 0;
  }
`;

const Td9Row = styled.div`
  margin: 8px auto 0;
  max-width: ${props => (props.mw !== undefined ? `${props.mw}px` : '1280px')};
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  .ant-tag {
    margin-bottom: 8px;
  }
`;

const Td9Summary = styled.div`
  flex: 1 1 30%;

  .ant-typography {
    margin-right: 8px;
  }

  @media (max-width: 768px) {
    flex: 1 1 100%;
    margin: 0 20px;
  }
`;

const Td9Load = styled.div`
  width: 100%;
  height: 100px;
`;

const Td9Echarts = styled.div`
  width: 100%;
`;

function App() {
  const [allData, setAllData] = useState([]);
  const [coinsInfo, setCoinInfo] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadTip, setLoadTip] = useState('');

  const [td9Dates, setTd9Dates] = useState([]);
  const [td9OPoints, setTd9OPoints] = useState({});

  const [curDate, setCurDate] = useState('');
  const [curType, setCurType] = useState('');
  const [curSymbols, setCurSymbols] = useState([]);
  const [curSymbol, setCurSymbol] = useState('');

  const [curSymbolInfo, setCurSymbolInfo] = useState({});

  const [ecKlinesOpt, setEcKlinesOpt] = useState({});
  const [ecKlinesHeight, setEcKlinesHeight] = useState(300);

  const types = {
    topPoints: '顶',
    confirmTopPoints: '大顶',
    bottomPoints: '底',
    confirmBottomPoints: '大底'
  };
  const colors = {
    topPoints: '#d87a16',
    confirmTopPoints: '#d32029',
    bottomPoints: '#177ddc',
    confirmBottomPoints: '#49aa19'
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(`${config.backend.base}${config.backend.klines}`);

      const { klines = [], coins = [] } = data;
      const symbols = Object.keys(klines);

      const fetchTd9 = async _ => {
        try {
          return await findTD9(klines[_], _);
        } catch (error) {
          return await fetchTd9(_);
        }
      };

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

      const dates = {};

      for (let i = 0, len = symbols.length; i < len; i++) {
        const _ = symbols[i];
        const { topPoints, confirmTopPoints, bottomPoints, confirmBottomPoints } = await fetchTd9(_);

        const findDate = (s, p) => {
          const key = Object.keys(p)[0];
          const points = Object.values(p)[0];

          points.forEach(_ => {
            const openTime = _.openTime;

            if (dates[openTime]) {
              if (dates[openTime][key]) {
                dates[openTime][key] = sortByVol([...dates[openTime][key], s]);
              } else {
                dates[openTime][key] = [s];
              }
            } else {
              dates[openTime] = {
                [key]: [s]
              };
            }
          });
        };

        findDate(_, { topPoints });
        findDate(_, { confirmTopPoints });
        findDate(_, { bottomPoints });
        findDate(_, { confirmBottomPoints });

        setLoadTip(`${i} / ${len}`);
      }

      setTd9OPoints(dates);
      setTd9Dates(Object.keys(dates).sort((a, b) => b - a));

      setAllData(klines);
      setCoinInfo(coins);

      setLoading(false);

      const clientWidth = document.body.clientWidth;
      const ecKlinesHeight = clientWidth > 786 ? (clientWidth / 2 > 400 ? 400 : 400) : clientWidth;
      setEcKlinesHeight(ecKlinesHeight);
    };
    fetchData();
  }, []);

  const formatDate = _ => {
    const d = new Date(parseInt(_));
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  const changeCurPoint = (date, type) => {
    setCurDate(date);
    setCurType(type);
    setCurSymbols(td9OPoints[date][type]);
    setCurSymbol('');
  };

  const changeCurSymbol = _ => {
    setCurSymbol(_);
    if (!allData[_]) return;

    setEcKlinesOpt(getEcKlinesOpt(allData[_], _));

    setCurSymbolInfo({});
    for (const coin of coinsInfo) {
      if (coin.title.includes(`(${getBaseAsset(_)})`) || coin.title.includes(`（${getBaseAsset(_)}）`)) {
        setCurSymbolInfo({
          ...coin,
          href: `${config.researchUrl.base}${coin.href}`
        });
      }
    }
  };

  return (
    <Layout>
      <Td9Main>
        <Td9Row mw={1000}>
          {td9Dates.map(_ => {
            return (
              <Td9Summary key={_}>
                <Text>__{formatDate(_)}__</Text>
                {Object.keys(td9OPoints[_]).map(t => {
                  return (
                    <Tag
                      key={t}
                      color={_ === curDate && t === curType ? 'default' : colors[t]}
                      onClick={() => changeCurPoint(_, t)}
                    >
                      {types[t]}({td9OPoints[_][t].length})
                    </Tag>
                  );
                })}
              </Td9Summary>
            );
          })}
        </Td9Row>

        {loading && (
          <Spin spinning={loading} tip={loadTip}>
            <Td9Load />
          </Spin>
        )}

        {curSymbols.length > 0 && (
          <>
            <Divider />

            <Td9Row>
              {curSymbols.map(_ => {
                return (
                  <div key={_}>
                    <Tag color={curSymbol === _ ? '#177ddc' : ''} onClick={() => changeCurSymbol(_)}>
                      {getBaseAsset(_)}
                    </Tag>
                  </div>
                );
              })}
            </Td9Row>

            <Divider />
          </>
        )}

        {curSymbol && (
          <Td9Row mt={0} mb={0}>
            <span>
              <a href={curSymbolInfo.href} target="_blank" rel="noreferrer">
                {curSymbolInfo.title}
              </a>{' '}
              {curSymbolInfo.description}
            </span>
          </Td9Row>
        )}

        <Td9Row>
          <Td9Echarts>
            {curSymbol && <ReactECharts theme="dark" style={{ height: `${ecKlinesHeight}px` }} option={ecKlinesOpt} />}
          </Td9Echarts>
        </Td9Row>

        <Footer />
      </Td9Main>
    </Layout>
  );
}

export default App;
