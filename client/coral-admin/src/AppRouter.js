import React from 'react';
import { Router, Route, Redirect, IndexRoute, IndexRedirect, browserHistory } from 'react-router';

import config from 'services/config'

import ModerationQueue from 'containers/ModerationQueue'
import CommentStream from 'containers/CommentStream'
import EmbedLink from 'components/EmbedLink'
import Configure from 'containers/Configure'
import CommunityContainer from 'containers/CommunityContainer'

const routes = (
  <Route path={config.base} component={LayoutContainer}>
    <IndexRoute component={ModerationQueue} />
    <Route path="embed" component={CommentStream} />
    <Route path="embedlink" component={EmbedLink} />
    <Route path="configure" component={Configure} />
    <Route path="community" component={CommunityContainer} />
  </Route>
);

const AppRouter = () => <Router history={browserHistory} routes={routes} />;

export default AppRouter;
