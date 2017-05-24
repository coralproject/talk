import React from 'react';
import {connect} from 'react-redux';
import Dashboard from '../components/Dashboard';
import {compose, graphql, gql} from 'react-apollo';

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

export const withQuery = graphql(gql`
  query Metrics($from: Date!, $to: Date!) {
    assetsByFlag: assetMetrics(from: $from, to: $to, sort: FLAG) {
      ...metrics
    }
    assetsByActivity: assetMetrics(from: $from, to: $to, sort: ACTIVITY) {
      ...metrics
    }
  }
  fragment metrics on Asset {
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
  withQuery,
)(DashboardContainer);
