import React from 'react';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';

import ModerationQueue from 'containers/ModerationQueue';
import CommentStream from 'containers/CommentStream';
import Configure from 'containers/Configure';
import CommunityContainer from 'containers/CommunityContainer';
import LayoutContainer from 'containers/LayoutContainer';

const routes = (
  <Route path='admin' component={LayoutContainer}>
    <IndexRoute component={ModerationQueue} />
    <Route path='embed' component={CommentStream} />
    <Route path='community' component={CommunityContainer} />
    <Route path='configure' component={Configure} />
  </Route>
);

const AppRouter = () => <Router history={browserHistory} routes={routes} />;

export default AppRouter;
