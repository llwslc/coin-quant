import React from 'react';
import { Typography } from 'antd';
import styled from 'styled-components';

const { Link } = Typography;

const FooterMain = styled.div`
  display: flex;
  justify-content: center;
  margin: 100px auto 40px;
  a {
    margin: 0 20px;
  }
`;

function App() {
  return (
    <FooterMain>
      <Link href="#/">Home</Link>
      <Link href="#/td9">TD9</Link>
      <Link href="#/help">Help</Link>
    </FooterMain>
  );
}

export default App;
