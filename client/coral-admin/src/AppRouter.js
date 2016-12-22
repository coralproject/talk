import React from 'react';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';

import ModerationQueue from 'containers/ModerationQueue/ModerationQueue';
import CommentStream from 'containers/CommentStream/CommentStream';
import Configure from 'containers/Configure/Configure';
import Streams from 'containers/Streams/Streams';
import CommunityContainer from 'containers/Community/CommunityContainer';
import LayoutContainer from 'containers/LayoutContainer';

const routes = (
  <Route path='/admin' component={LayoutContainer}>
    <IndexRoute component={ModerationQueue} />
    <Route path='embed' component={CommentStream} />
    <Route path='community' component={CommunityContainer} />
    <Route path='configure' component={Configure} />
    <Route path='streams' component={Streams} />
  </Route>
);

const AppRouter = () => <Router history={browserHistory} routes={routes} />;

export default AppRouter;
