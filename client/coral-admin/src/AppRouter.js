import React from 'react';
import PropTypes from 'prop-types';
import { Router, Route, IndexRedirect, IndexRoute } from 'react-router';

import Configure from 'routes/Configure';
import Install from 'routes/Install';
import Stories from 'routes/Stories';
import Community from 'routes/Community';
import { ModerationLayout, Moderation } from 'routes/Moderation';

import Layout from 'containers/Layout';

const routes = (
  <div>
    <Route exact path="/admin/install" component={Install} />
    <Route path="/admin" component={Layout}>
      <IndexRedirect to="/admin/moderate" />
      <Route path="configure" component={Configure} />
      <Route path="stories" component={Stories} />

      {/* Community Routes */}

      <Route path="community">
        <Route path="flagged" components={Community}>
          <Route path=":id" components={Community} />
        </Route>
        <Route path="people" components={Community}>
          <Route path=":id" components={Community} />
        </Route>
        <IndexRedirect to="flagged" />
      </Route>

      {/* Moderation Routes */}

      <Route path="moderate" component={ModerationLayout}>
        <IndexRoute components={Moderation} />

        <Route path=":tabOrId" components={Moderation} />

        <Route path=":tab" components={Moderation}>
          <Route path=":id" components={Moderation} />
        </Route>
      </Route>
    </Route>
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
