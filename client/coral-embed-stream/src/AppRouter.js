import React from 'react';
import {Router, Route, browserHistory} from 'react-router';

import Embed from './containers/Embed';
import SignInContainer from 'coral-sign-in/containers/SignInContainer';

const routes = (
  <div>
    <Route exact path="/embed/stream/login" component={SignInContainer}/>
    <Route exact path="*" component={Embed}/>
  </div>
);

const AppRouter = () => <Router history={browserHistory} routes={routes} />;

export default AppRouter;
