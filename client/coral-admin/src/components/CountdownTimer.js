import React, {PropTypes} from 'react';
import I18n from 'coral-i18n/modules/i18n/i18n';
import translations from 'coral-admin/src/translations';
import styles from 'coral-admin/src/containers/Dashboard/Dashboard.css';
import {Icon} from 'coral-ui';

const lang = new I18n(translations);
const refreshIntervalSeconds = 60 * 5;

class CountdownTimer extends React.Component {

  static propTypes = {
    handleTimeout: PropTypes.func.isRequired
  }

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
    this.interval = setInterval(() => { // the countdown timer
      let nextCount = this.state.secondsUntilRefresh - 1;
      if (nextCount < 0) {
        nextCount = refreshIntervalSeconds;
        return this.props.handleTimeout();
      }
      this.setState({secondsUntilRefresh: nextCount});
    }, 1000);
  }

  componentWillUnmount () {
    window.clearInterval(this.interval);
  }

  formatTime = () => {
    const minutes = Math.floor(this.state.secondsUntilRefresh / 60);
    let seconds = (this.state.secondsUntilRefresh % 60).toString();
    if (seconds.length < 2) {
      seconds = `0${seconds}`;
    }

    return `${minutes}:${seconds}`;
  }

  dismissNote = () => {
    try {
      window.localStorage.setItem('coral:dashboardNote', 'hide');
    } catch (e) {

      // when setItem fails in Safari Private mode
      this.setState({dashboardNote: 'hide'});
    }
  }

  render () {
    const hideReloadNote = window.localStorage.getItem('coral:dashboardNote') === 'hide' ||
      this.state.dashboardNote === 'hide'; // for Safari Incognito
    return (
      <p
        style={{display: hideReloadNote ? 'none' : 'block'}}
        className={styles.autoUpdate}
        onClick={this.dismissNote}>
        <b>×</b>
        <Icon name='timer' /> <strong>{lang.t('dashboard.next-update', this.formatTime())}</strong> {lang.t('dashboard.auto-update')}
      </p>
    );
  }
}

export default CountdownTimer;
