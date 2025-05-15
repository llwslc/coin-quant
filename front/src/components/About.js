import React from 'react';
import { Typography } from 'antd';
import styled from 'styled-components';

const { Link } = Typography;

const AboutStyle = styled.div`
  padding: 20px;

  h1 {
    color: #fff;
  }
`;

const CopyrightStyle = styled.h2`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 20px;
`;

const BlogStyle = styled.div`
  width: 800px;
  margin: 0 auto;

  h2 {
    padding: 5px 0;
  }
`;

function App() {
  return (
    <AboutStyle>
      <BlogStyle>
        <h1>TRX.GIFT</h1>
        <h2>trx.gift 现已申请集成 TradingView，带来了更直观的图表和技术分析工具。</h2>
        <h2>通过这一合作，用户可以：</h2>
        <h2>1.实时市场分析</h2>
        <h2>
          使用 TradingView 的专业K线图和技术指标，轻松跟踪加密货币的价格走势，优化交易策略。例如，通过{' '}
          <Link href="https://www.tradingview.com/symbols/BTCUSD/" target="_blank">
            BTC/USD
          </Link>{' '}
          的价格趋势图，用户可以一目了然地了解不同加密货币的价格变化和市场动态，帮助制定更具战略性的交易计划。
        </h2>
        <h2>2.回测功能</h2>
        <h2>模拟历史数据中的交易决策，帮助用户优化策略，提高投资回报。</h2>
        <h2>3.无缝体验</h2>
        <h2>将来，用户可以直接在 trx.gift 交易界面中使用 TradingView 工具，无需切换平台，操作更加高效便捷。</h2>
        <h2>如果能够达成与 TradingView 的结合，trx.gift 将能够为用户提供更智能、更便捷的交易支持。</h2>
      </BlogStyle>

      <CopyrightStyle>© 2025 北京超木子商贸中心 All rights reserved</CopyrightStyle>
    </AboutStyle>
  );
}

export default App;
