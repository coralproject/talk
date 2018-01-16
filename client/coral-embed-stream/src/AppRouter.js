import React from 'react';
import { Router, Route } from 'react-router';
import PropTypes from 'prop-types';

import Embed from './containers/Embed';
import { LoginContainer } from 'coral-sign-in/containers/LoginContainer';

const routes = (
  <div>
    <Route exact path="/embed/stream/login" component={LoginContainer} />
    <Route path="*" component={Embed} />
  </div>
);

class AppRouter extends React.Component {
  static contextTypes = {
    history: PropTypes.object,
  };

  render() {
    return <Router history={this.context.history} routes={routes} />;
  }
}

export default AppRouter;
