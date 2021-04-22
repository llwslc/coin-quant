import React from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';

import Fallback from '../components/Fallback';
const Home = React.lazy(() => import('../components/Home'));
const Help = React.lazy(() => import('../components/Help'));
const Td9 = React.lazy(() => import('../components/Td9'));

function App() {
  return (
    <HashRouter>
      <React.Suspense fallback={<Fallback />}>
        <Switch>
          <Route path="/help" component={Help} />
          <Route path="/td9" component={Td9} />
          <Route component={Home} />
        </Switch>
      </React.Suspense>
    </HashRouter>
  );
}

export default App;
