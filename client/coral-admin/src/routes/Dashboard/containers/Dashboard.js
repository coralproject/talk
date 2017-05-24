import React from 'react';
import {connect} from 'react-redux';
import Dashboard from '../components/Dashboard';
import {compose,  gql} from 'react-apollo';
import withQuery from 'coral-framework/hocs/withQuery';

import {Spinner} from 'coral-ui';

class DashboardContainer extends React.Component {

  reloadData = () => {
    this.props.data.refetch();
  }

  render () {
    if (this.props.data.loading) {
      return <Spinner />;
    }
    return <Dashboard {...this.props} reloadData={this.reloadData} />;
  }
}

export const witDashboardQuery = withQuery(gql`
  query Admin_Dashboard($from: Date!, $to: Date!) {
    assetsByFlag: assetMetrics(from: $from, to: $to, sort: FLAG) {
      ...Admin_Metrics
    }
    assetsByActivity: assetMetrics(from: $from, to: $to, sort: ACTIVITY) {
      ...Admin_Metrics
    }
  }
  fragment Admin_Metrics on Asset {
    id
    title
    url
    author
    created_at
    commentCount
    action_summaries {
      actionCount
      actionableItemCount
    }
  }
`, {
  options: ({settings: {dashboardWindowStart, dashboardWindowEnd}}) => {
    return {
      variables: {
        from: dashboardWindowStart,
        to: dashboardWindowEnd
      }
    };
  }
});

const mapStateToProps = (state) => {
  return {
    settings: state.settings.toJS(),
    moderation: state.moderation.toJS()
  };
};

export default compose(
  connect(mapStateToProps),
  witDashboardQuery,
)(DashboardContainer);
