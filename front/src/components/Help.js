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
        <Text type="danger">所有人都想赚钱会是崩盘前夜(地铁,抖音都在买基金,买币代表增量用户结束)</Text>
        <Text type="warning">下跌到恐惧的地步会是底部</Text>
        <Text type="success">When the music is on you gotta dance</Text>
        <Text type="warning">实质性下跌还是恐慌性下跌</Text>
        <Text type="danger">亏钱时的痛苦感比赚钱时的喜悦感要高得多</Text>
        <Text>停损不停利</Text>
        <Text type="danger">Go big or go home</Text>
        <Text type="warning">卖出的时候第一时间思考什么时候买入</Text>
        <Text type="success">牛市新出的币在一开始就会被高估</Text>
        <Text type="warning">矿工借钱开矿场也属于加杠杆行为</Text>
        <Text type="danger">BTC占比过低是不可持续的(BTC不涨或全线崩盘)</Text>
        <Text>主流趋势缺点,山寨会爆发,赢过主流后崩盘</Text>
        <Text type="danger">Defi 本质是给币圈加入了债务周期</Text>
        <Text type="warning">有用就有价, 没用的 meme 没有上限, 买了就囤着才能一直涨</Text>

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
          BTC多空比 (大于 1.3 高位)
        </Link>
        <Link href="https://alternative.me/crypto/fear-and-greed-index/" target="_blank">
          恐惧 {'&'} 贪婪指数 (10 买 70 卖)
        </Link>
      </HelpWarning>
      <Help>
        <Footer />
      </Help>
    </Layout>
  );
}

export default App;
