import React from 'react';
import {Router, Route} from 'react-router';
import {history} from 'coral-framework/helpers/router';

import Embed from './containers/Embed';
import {LoginContainer} from 'coral-sign-in/containers/LoginContainer';

const routes = (
  <div>
    <Route exact path="/embed/stream/login" component={LoginContainer}/>
    <Route path="*" component={Embed}/>
  </div>
);

const AppRouter = () => <Router history={history} routes={routes} />;

export default AppRouter;
