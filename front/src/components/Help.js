import React from 'react';
import styled from 'styled-components';
import { Layout, Typography } from 'antd';

const { Footer } = Layout;
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
      </HelpWarning>
      <Help>
        <Footer>
          <Link href="#/">Home</Link>
        </Footer>
      </Help>
    </Layout>
  );
}

export default App;
