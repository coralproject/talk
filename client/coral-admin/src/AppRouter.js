import React from 'react';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';

import Streams from 'containers/Streams/Streams';
import Configure from 'containers/Configure/Configure';
import LayoutContainer from 'containers/LayoutContainer';
import CommentStream from 'containers/CommentStream/CommentStream';
import InstallContainer from 'containers/Install/InstallContainer';
import CommunityContainer from 'containers/Community/CommunityContainer';
import ModerationContainer from 'containers/ModerationQueue/ModerationContainer';

const routes = (
  <div>
    <Route exact path="/admin/install" component={InstallContainer}/>
    <Route path='/admin' component={LayoutContainer}>
      <IndexRoute component={ModerationContainer} />
      <Route path='embed' component={CommentStream} />
      <Route path='community' component={CommunityContainer} />
      <Route path='configure' component={Configure} />
      <Route path='streams' component={Streams} />
    </Route>
  </div>
);

const AppRouter = () => <Router history={browserHistory} routes={routes} />;

export default AppRouter;
