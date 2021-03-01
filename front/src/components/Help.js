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
  margin: 2rem;
  text-align: center;
  font-size: 2rem;
`;

function App() {
  return (
    <Layout>
      <HelpWarning>
        <Text type="success">面对危险状况，人类最自然的反应是什么都不做</Text>
        <br />
        <Text type="warning">真正做生意的人，只赚取有限的利润。暴利是长久不了的。</Text>
        <br />
        <Text type="danger">严格按照自己的策略操作，不要情绪化</Text>
        <br />
        <Text>抄底不满仓，止盈不全抛</Text>
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
