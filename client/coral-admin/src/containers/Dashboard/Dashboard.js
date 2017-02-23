import React from 'react';
import styles from './Dashboard.css';
import {graphql, compose} from 'react-apollo';
import {connect} from 'react-redux';
import FlagWidget from './FlagWidget';
import LikeWidget from './LikeWidget';
import METRICS from 'coral-admin/src/graphql/queries/metrics.graphql';
import MostLikedCommentsWidget from './MostLikedCommentsWidget';
import {showBanUserDialog, hideBanUserDialog} from 'coral-admin/src/actions/moderation';
import {banUser, setCommentStatus} from 'coral-admin/src/graphql/mutations';
import {Spinner} from 'coral-ui';

class Dashboard extends React.Component {

  render () {

    if (this.props.data && this.props.data.loading) {
      return <Spinner />;
    }

    console.log(this.props.data);

    const {data: {assetsByLike, assetsByFlag, mostLikedComments}} = this.props;

    console.log('assetsByLike', assetsByLike);
    console.log('assetsByFlag', assetsByFlag);

    const {moderation, settings} = this.props;

    return (
      <div className={styles.Dashboard}>
        <FlagWidget assets={assetsByFlag} />
        <MostLikedCommentsWidget
          comments={mostLikedComments}
          moderation={moderation}
          settings={settings}
          acceptComment={this.props.acceptComment}
          rejectComment={this.props.rejectComment}
          handleBanUser={this.props.banUser}
          showBanUserDialog={this.props.showBanUserDialog}
          hideBanUserDialog={this.props.hideBanUserDialog} />
        <LikeWidget assets={assetsByLike} />
      </div>
    );
  }
}

let then = new Date();
then.setMinutes(then.getMinutes() - 205);
then = then.toISOString();
const now = new Date().toISOString();

const getMetrics = graphql(METRICS, {
  options: () => {

    return {
      variables: {
        from: then,
        to: now
      }
    };
  }
});

const DashboardWithData = compose(getMetrics, setCommentStatus, banUser)(Dashboard);

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
