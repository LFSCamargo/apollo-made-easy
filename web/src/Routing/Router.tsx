import * as React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Landing from '../screens/Landing/Landing';
import Login from 'src/screens/Login/Login';

export default () => (
  <BrowserRouter>
    <div>
      <Route path="/" exact component={Login} />
      <Route path="/home" exact component={Landing} />
    </div>
  </BrowserRouter>
);
