import React from 'react';
import styles from './Dashboard.css';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import {getMetrics} from 'coral-admin/src/graphql/queries';
import FlagWidget from './FlagWidget';
import LikeWidget from './LikeWidget';
import {showBanUserDialog, hideBanUserDialog} from 'coral-admin/src/actions/moderation';

import {Spinner} from 'coral-ui';

class Dashboard extends React.Component {

  render () {

    if (this.props.data && this.props.data.loading) {
      return <Spinner />;
    }

    const {data: {assetsByLike, assetsByFlag}} = this.props;

    return (
      <div className={styles.Dashboard}>
        <FlagWidget assets={assetsByFlag} />
        <LikeWidget assets={assetsByLike} />
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
