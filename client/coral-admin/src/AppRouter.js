import React from 'react';
import { Router, Route, Redirect, IndexRoute, IndexRedirect, browserHistory } from 'react-router';

import config from 'services/config'

import ModerationQueue from 'containers/ModerationQueue'
import CommentStream from 'containers/CommentStream'
import EmbedLink from 'components/EmbedLink'
import Configure from 'containers/Configure'
import CommunityContainer from 'containers/CommunityContainer'
import LayoutContainer from 'containers/LayoutContainer'

const routes = (
  <Route component={LayoutContainer}>
    <Route path='admin' component={ModerationQueue} />
    <Route path='admin/embed' component={CommentStream} />
    <Route path='admin/embedlink' component={EmbedLink} />
    <Route path='admin/configure' component={Configure} />
  </Route>
);

const AppRouter = () => <Router history={browserHistory} routes={routes} />;

export default AppRouter;
