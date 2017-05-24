import React from 'react';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import {getMetrics} from 'coral-admin/src/graphql/queries';
import Dashboard from '../components/Dashboard';

import {Spinner} from 'coral-ui';

class DashboardContainer extends React.Component {

  reloadData = () => {
    this.props.data.refetch();
  }

  render () {
    if (this.props.data && this.props.data.loading) {
      return <Spinner />;
    }
    return <Dashboard {...this.props} reloadData={this.reloadData} />;
  }
}

const mapStateToProps = (state) => {
  return {
    settings: state.settings.toJS(),
    moderation: state.moderation.toJS()
  };
};

export default compose(
  connect(mapStateToProps),
  getMetrics
)(DashboardContainer);
