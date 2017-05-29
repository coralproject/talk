import React from 'react';
import {Router, Route, browserHistory} from 'react-router';

import Embed from './containers/Embed';
import {LoginContainer} from 'coral-sign-in/containers/LoginContainer';

const routes = (
  <div>
    <Route exact path="/embed/stream/login" component={LoginContainer}/>
    <Route path="*" component={Embed}/>
  </div>
);

const AppRouter = () => <Router history={browserHistory} routes={routes} />;

export default AppRouter;
