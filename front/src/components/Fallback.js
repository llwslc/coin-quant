import React from 'react';
import styled from 'styled-components';
import { Spin } from 'antd';

const Loading = styled.div`
  text-align: center;
`;

function App() {
  return (
    <Loading>
      <Spin />
    </Loading>
  );
}

export default App;
