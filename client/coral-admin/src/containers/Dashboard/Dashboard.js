import React from 'react';
import styles from './Dashboard.css';
import {graphql} from 'react-apollo';
import {connect} from 'react-redux';
import FlagWidget from './FlagWidget';
import LikeWidget from './LikeWidget';
import METRICS from 'coral-admin/src/graphql/queries/metrics.graphql';
// import MostLikedCommentsWidget from './MostLikedCommentsWidget';
import {showBanUserDialog, hideBanUserDialog} from 'coral-admin/src/actions/moderation';
import {Spinner} from 'coral-ui';

class Dashboard extends React.Component {

  render () {

    if (this.props.data && this.props.data.loading) {
      return <Spinner />;
    }

    console.log(this.props.data);

    const {data: {assetsByLike, assetsByFlag}} = this.props;

    console.log('assetsByLike', assetsByLike);
    console.log('assetsByFlag', assetsByFlag);

    // const {moderation, settings} = this.props;

    return (
      <div className={styles.Dashboard}>
        {assetsByFlag && <FlagWidget assets={assetsByFlag} />}
        {/*<MostLikedCommentsWidget
          moderation={moderation}
          settings={settings}
          showBanUserDialog={this.props.showBanUserDialog}
          hideBanUserDialog={this.props.hideBanUserDialog} />*/}
        {assetsByLike && <LikeWidget assets={assetsByLike} />}
      </div>
    );
  }
}

let fiveMinutesAgo = new Date();
fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);
fiveMinutesAgo = fiveMinutesAgo.toISOString();
const now = new Date().toISOString();

const getMetrics = graphql(METRICS, {
  options: () => {

    return {
      variables: {
        from: fiveMinutesAgo,
        // from: '2017-02-23T16:09:44.235Z',
        to: now
        // to: '2017-02-23T19:30:23.251Z'
      }
    };
  }
});

const DashboardWithData = getMetrics(Dashboard);

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

export default connect(mapStateToProps, mapDispatchToProps)(DashboardWithData);
