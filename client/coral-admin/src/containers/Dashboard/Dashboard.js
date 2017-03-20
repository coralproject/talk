import React from 'react';
import styles from './Dashboard.css';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import {getMetrics} from 'coral-admin/src/graphql/queries';
import FlagWidget from './FlagWidget';
import LikeWidget from './LikeWidget';
import ActivityWidget from './ActivityWidget';
import {showBanUserDialog, hideBanUserDialog} from 'coral-admin/src/actions/moderation';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from 'coral-admin/src/translations';
import {Spinner, Icon} from 'coral-ui';

const lang = new I18n(translations);
const refreshIntervalSeconds = 60 * 5;

class Dashboard extends React.Component {

  constructor (props) {
    super(props);

    try {
      if (window.localStorage.getItem('coral:dashboardNote') === null) {
        window.localStorage.setItem('coral:dashboardNote', 'show');
      }
    } catch (e) {

      // above will fail in Private Mode in some browsers.
    }

    this.state = {
      secondsUntilRefresh: refreshIntervalSeconds,
      dashboardNote: window.localStorage.getItem('coral:dashboardNote') || 'show'
    };
  }

  componentWillMount () {
    setInterval(() => { // the countdown timer
      let nextCount = this.state.secondsUntilRefresh - 1;
      if (nextCount < 0) {
        nextCount = refreshIntervalSeconds;
        this.props.data.refetch();
      }
      this.setState({secondsUntilRefresh: nextCount});
    }, 1000);
  }

  dismissNote = () => {
    try {
      window.localStorage.setItem('coral:dashboardNote', 'hide');
    } catch (e) {

      // when setItem fails in Safari Private mode
      this.setState({dashboardNote: 'hide'});
    }
  }

  formatTime = () => {
    const minutes = Math.floor(this.state.secondsUntilRefresh / 60);
    let seconds = (this.state.secondsUntilRefresh % 60).toString();
    if (seconds.length < 2) {
      seconds = `0${seconds}`;
    }

    return `${minutes}:${seconds}`;
  }

  render () {

    if (this.props.data && this.props.data.loading) {
      return <Spinner />;
    }

    const {data: {assetsByLike, assetsByFlag, assetsByActivity}} = this.props;
    const hideReloadNote = window.localStorage.getItem('coral:dashboardNote') === 'hide' ||
      this.state.dashboardNote === 'hide'; // for Safari Incognito

    return (
      <div>
        <p
          style={{display: hideReloadNote ? 'none' : 'block'}}
          className={styles.autoUpdate}
          onClick={this.dismissNote}>
          <b>×</b>
          <Icon name='timer' /> <strong>{lang.t('dashboard.next-update', this.formatTime())}</strong> {lang.t('dashboard.auto-update')}
        </p>
        <div className={styles.Dashboard}>
          <FlagWidget assets={assetsByFlag} />

          <LikeWidget assets={assetsByLike} />
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
