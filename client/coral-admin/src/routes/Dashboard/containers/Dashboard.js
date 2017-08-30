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
  query CoralAdmin_Dashboard($from: Date!, $to: Date!) {
    assetsByFlag: assetMetrics(from: $from, to: $to, sortBy: FLAG) {
      ...CoralAdmin_Metrics
    }
    assetsByActivity: assetMetrics(from: $from, to: $to, sortBy: ACTIVITY) {
      ...CoralAdmin_Metrics
    }
  }
  fragment CoralAdmin_Metrics on Asset {
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
    settings: state.settings,
    moderation: state.moderation
  };
};

export default compose(
  connect(mapStateToProps),
  witDashboardQuery,
)(DashboardContainer);
