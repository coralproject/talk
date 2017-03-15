import React from 'react';
import styles from './Dashboard.css';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import {getMetrics} from 'coral-admin/src/graphql/queries';
import FlagWidget from './FlagWidget';
import ActivityWidget from './ActivityWidget';
import CountdownTimer from 'coral-admin/src/components/CountdownTimer';
import {showBanUserDialog, hideBanUserDialog} from 'coral-admin/src/actions/moderation';

import {Spinner} from 'coral-ui';

class Dashboard extends React.Component {

  reloadData = () => {
    this.props.data.refetch();
  }

  render () {

    if (this.props.data && this.props.data.loading) {
      return <Spinner />;
    }

    console.log('data', this.props.data);

    const {data: {assetsByActivity, assetsByFlag}} = this.props;

    console.log('assetsByActivity', assetsByActivity);
    console.log('assetsByFlag', assetsByActivity);

    return (
      <div>
        <CountdownTimer handleTimeout={this.reloadData} />
        <div className={styles.Dashboard}>
          <FlagWidget assets={assetsByFlag} />
          <ActivityWidget assets={assetsByActivity} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    settings: state.settings.toJS(),
    moderation: state.moderation.toJS()
  };
};

const mapDispatchToProps = dispatch => ({
  showBanUserDialog: (user, commentId) => dispatch(showBanUserDialog(user, commentId)),
  hideBanUserDialog: () => dispatch(hideBanUserDialog(false))
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  getMetrics
)(Dashboard);
