import React from 'react';
import { Typography } from 'antd';
import styled from 'styled-components';

const { Link } = Typography;

const FooterMain = styled.div``;

const LinkStyle = styled.div`
  display: flex;
  justify-content: center;
  margin: 100px auto 40px;
  a {
    margin: 0 20px;
  }
`;

const CopyrightStyle = styled.div`
  display: flex;
  justify-content: center;
`;

function App() {
  return (
    <FooterMain>
      <LinkStyle>
        <Link href="#/">Home</Link>
        <Link href="#/about">About</Link>
        <Link href="#/td9">TD9</Link>
        <Link href="#/help">Help</Link>
      </LinkStyle>

      <CopyrightStyle>© 2025 北京超木子商贸中心 All rights reserved</CopyrightStyle>
    </FooterMain>
  );
}

export default App;
