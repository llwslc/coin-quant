import React from 'react';
import styled from 'styled-components';
import { Layout, Typography } from 'antd';

import Footer from './Footer';

const { Link, Text } = Typography;

const Help = styled.div`
  display: flex;
  justify-content: center;
`;

const HelpWarning = styled.div`
  display: flex;
  flex-flow: column;
  margin: 2rem;
  text-align: center;
  font-size: 2rem;

  span,
  a {
    margin: auto;
  }
`;

function App() {
  return (
    <Layout>
      <HelpWarning>
        <Text type="success">面对危险状况，人类最自然的反应是什么都不做</Text>
        <Text type="warning">真正做生意的人，只赚取有限的利润。暴利是长久不了的。</Text>
        <Text type="danger">严格按照自己的策略操作，不要情绪化</Text>
        <Text>抄底不满仓，止盈不全抛</Text>
        <Text type="danger">所有人都赚钱会是崩盘前夜(全民买基金,发动物币)</Text>
        <Text type="warning">下跌到恐惧的地步会是底部</Text>
        <Text type="success">When the music is on you gotta dance</Text>
        <Text type="warning">实质性下跌还是恐慌性下跌</Text>
        <Text type="danger">亏钱时的痛苦感比赚钱时的喜悦感要高得多</Text>
        <Text>停损不停利</Text>
        <Text type="warning">Go big or go home</Text>

        <Link href="https://bitbo.io/" target="_blank">
          bitbo
        </Link>
        <Link href="https://digitalik.net/btc/" target="_blank">
          digitalik
        </Link>
        <Link href="https://cryptoquant.com/overview/full/180?window=day" target="_blank">
          BTC: All Miners Outflow
        </Link>
        <Link href="https://www.blockchaincenter.net/altcoin-season-index/" target="_blank">
          Altcoin Season Index
        </Link>
        <Link href="https://hodlwave.com/" target="_blank">
          Bitcoin UTXO Age Distribution
        </Link>
        <Link href="https://www.blockchaincenter.net/bitcoin-rainbow-chart/" target="_blank">
          Bitcoin "Rainbow" Price Chart
        </Link>
        <Link href="https://ahr999.com/" target="_blank">
          比特币囤币ahr999指数
        </Link>
        <Link href="https://www.tradingview.com/chart/?symbol=CRYPTOCAP%3ABTC.D" target="_blank">
          Market Cap BTC Dominance
        </Link>
        <Link href="https://www.lookintobitcoin.com/charts/bitcoin-investor-tool/" target="_blank">
          Bitcoin Investor Tool: 2-Year MA Multiplier
        </Link>
        <Link href="https://www.lookintobitcoin.com/charts/200-week-moving-average-heatmap/" target="_blank">
          200 Week Moving Average Heatmap
        </Link>
        <Link href="https://www.lookintobitcoin.com/charts/stock-to-flow-model/" target="_blank">
          Stock-to-Flow Model
        </Link>
        <Link href="https://www.lookintobitcoin.com/charts/pi-cycle-top-indicator/" target="_blank">
          Pi Cycle Top Indicator
        </Link>
        <Link href="https://charts.coinmetrics.io/network-data/" target="_blank">
          Coinmetrics
        </Link>
        <Link href="https://www.mytokencap.com/concept/263" target="_blank">
          Binance Investment
        </Link>
        <Link href="https://www.bybt.com/zh/MA" target="_blank">
          BTC逃顶指标·抄底买入信号解读
        </Link>
        <Link href="https://www.bybt.com/zh/LongShortRatio" target="_blank">
          BTC多空比
        </Link>
      </HelpWarning>
      <Help>
        <Footer />
      </Help>
    </Layout>
  );
}

export default App;
