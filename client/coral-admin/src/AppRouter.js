import React from 'react';
import {Router, Route, IndexRoute, IndexRedirect, browserHistory} from 'react-router';

import Streams from 'containers/Streams/Streams';
import Configure from 'containers/Configure/Configure';
import LayoutContainer from 'containers/LayoutContainer';
import InstallContainer from 'containers/Install/InstallContainer';

import CommunityLayout from 'containers/Community/CommunityLayout';
import CommunityContainer from 'containers/Community/CommunityContainer';

import ModerationLayout from 'containers/ModerationQueue/ModerationLayout';
import ModerationContainer from 'containers/ModerationQueue/ModerationContainer';

import Dashboard from 'containers/Dashboard/Dashboard';

const routes = (
  <div>
    <Route exact path="/admin/install" component={InstallContainer}/>
    <Route path='/admin' component={LayoutContainer}>
      <IndexRoute component={Dashboard} />
      <Route path='community' component={CommunityContainer} />
      <Route path='configure' component={Configure} />
      <Route path='streams' component={Streams} />
      <Route path='dashboard' component={Dashboard} />

      {/* Community Routes */}

      <Route path='community' component={CommunityLayout}>
        <Route path='flagged' components={CommunityContainer}>
          <Route path=':id' components={CommunityContainer} />
        </Route>
        <Route path='people' components={CommunityContainer}>
          <Route path=':id' components={CommunityContainer} />
        </Route>
        <IndexRedirect to='flagged' />
      </Route>

      {/* Moderation Routes */}

      <Route path='moderate' component={ModerationLayout}>
        <Route path='premod' components={ModerationContainer}>
          <Route path=':id' components={ModerationContainer} />
        </Route>
        <Route path='rejected' components={ModerationContainer}>
          <Route path=':id' components={ModerationContainer} />
        </Route>
        <Route path='flagged' components={ModerationContainer}>
          <Route path=':id' components={ModerationContainer} />
        </Route>
        <Route path=':id' components={ModerationContainer} />
        <IndexRedirect to='premod' />
      </Route>
    </Route>
  </div>
);

const AppRouter = () => <Router history={browserHistory} routes={routes} />;

export default AppRouter;
