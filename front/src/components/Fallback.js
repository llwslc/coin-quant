import React from 'react';
import styled from 'styled-components';
import { Spin } from 'antd';

const Loading = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function App() {
  return (
    <Loading>
      <Spin />
    </Loading>
  );
}

export default App;
