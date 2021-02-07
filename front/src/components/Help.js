import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Layout, Typography } from 'antd';
import { readFavorites } from '../utils';

const { Footer } = Layout;
const { Link } = Typography;

const Help = styled.div`
  display: flex;
  justify-content: center;
`;

function App() {
  return (
    <Layout>
      <Help>
        <Footer>
          <Link href="#/">Home</Link>
        </Footer>
      </Help>
    </Layout>
  );
}

export default App;
