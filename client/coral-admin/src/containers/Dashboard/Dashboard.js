import React from 'react';
import {compose} from 'react-apollo';
import {mostFlags} from 'coral-admin/src/graphql/queries';

class Dashboard extends React.Component {
  render () {
    return (
      <div>Dashboard</div>
    );
  }
}

export default compose(
  mostFlags
)(Dashboard);
