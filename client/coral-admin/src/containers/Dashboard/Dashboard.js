import React from 'react';
import styles from './Dashboard.css';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import {getMetrics} from 'coral-admin/src/graphql/queries';
import FlagWidget from './FlagWidget';
import {showBanUserDialog, hideBanUserDialog} from 'coral-admin/src/actions/moderation';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from 'coral-admin/src/translations';
import {Spinner, Icon} from 'coral-ui';

const lang = new I18n(translations);
const refreshIntervalSeconds = 60 * 5;

class Dashboard extends React.Component {

  state = {
    noteHidden: false,
    secondsUntilRefresh: refreshIntervalSeconds
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

    const {data: {assetsByFlag}} = this.props;

    return (
      <div>
        <p
          style={{display: this.state.noteHidden ? 'none' : 'block'}}
          className={styles.autoUpdate}
          onClick={() => this.setState({noteHidden: true})}>
          <b>×</b>
          <Icon name='timer' /> <strong>{lang.t('dashboard.next-update', this.formatTime())}</strong> {lang.t('dashboard.auto-update')}
        </p>
        <div className={styles.Dashboard}>
          <FlagWidget assets={assetsByFlag} />
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
