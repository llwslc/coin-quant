import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button } from 'antd';
import { readFavorites } from '../utils';

const Loading = styled.div`
  text-align: center;
`;

function App() {
  useEffect(() => {
    console.log(readFavorites());
  }, []);

  return (
    <Loading>
      <Button type="primary">Button</Button>
    </Loading>
  );
}

export default App;
