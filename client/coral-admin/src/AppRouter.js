import React from 'react';
import {Router, Route, IndexRedirect} from 'react-router';
import {history} from 'coral-framework/helpers/router';

import Configure from 'routes/Configure';
import Dashboard from 'routes/Dashboard';
import Install from 'routes/Install';
import Stories from 'routes/Stories';
import {CommunityLayout, Community} from 'routes/Community';
import {ModerationLayout, Moderation} from 'routes/Moderation';

import Layout from 'containers/Layout';

const routes = (
  <div>
    <Route exact path="/admin/install" component={Install}/>
    <Route path='/admin' component={Layout}>
      <IndexRedirect to='/admin/moderate/all' />
      <Route path='configure' component={Configure} />
      <Route path='stories' component={Stories} />
      <Route path='dashboard' component={Dashboard} />

      {/* Community Routes */}

      <Route path='community' component={CommunityLayout}>
        <Route path='flagged' components={Community}>
          <Route path=':id' components={Community} />
        </Route>
        <Route path='people' components={Community}>
          <Route path=':id' components={Community} />
        </Route>
        <IndexRedirect to='flagged' />
      </Route>

      {/* Moderation Routes */}

      <Route path='moderate' component={ModerationLayout}>
        <IndexRoute component={Moderation} />
        <Route path='all' components={Moderation}>
          <Route path=':id' components={Moderation} />
        </Route>
        <Route path='new' components={Moderation}>
          <Route path=':id' components={Moderation} />
        </Route>
        <Route path='approved' components={Moderation}>
          <Route path=':id' components={Moderation} />
        </Route>
        <Route path='premod' components={Moderation}>
          <Route path=':id' components={Moderation} />
        </Route>
        <Route path='rejected' components={Moderation}>
          <Route path=':id' components={Moderation} />
        </Route>
        <Route path='reported' components={Moderation}>
          <Route path=':id' components={Moderation} />
        </Route>
      </Route>
    </Route>
  </div>
);

const AppRouter = () => <Router history={history} routes={routes}/>;

export default AppRouter;
