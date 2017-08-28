import React from 'react';
import PropTypes from 'prop-types';
import styles from './Dashboard.css';
import {Icon} from 'coral-ui';

import t from 'coral-framework/services/i18n';
const refreshIntervalSeconds = 60 * 5;

// TODO: refactor out storage code into redux.

class CountdownTimer extends React.Component {

  static contextTypes = {
    storage: PropTypes.object,
  };

  static propTypes = {
    handleTimeout: PropTypes.func.isRequired
  }

  constructor (props, context) {
    super(props, context);
    const {storage} = context;
    try {
      if (storage && storage.getItem('coral:dashboardNote') === null) {
        storage.setItem('coral:dashboardNote', 'show');
      }
    } catch (e) {

      // above will fail in Private Mode in some browsers.
    }

    this.state = {
      secondsUntilRefresh: refreshIntervalSeconds,
      dashboardNote: (storage && storage.getItem('coral:dashboardNote')) || 'show'
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
    const {storage} = this.context;
    try {
      if (storage) {
        storage.setItem('coral:dashboardNote', 'hide');
      }
    } catch (e) {

      // when setItem fails in Safari Private mode
      this.setState({dashboardNote: 'hide'});
    }
  }

  render () {
    const {storage} = this.context;
    const hideReloadNote = (storage && storage.getItem('coral:dashboardNote') === 'hide') ||
      this.state.dashboardNote === 'hide'; // for Safari Incognito
    return (
      <p
        style={{display: hideReloadNote ? 'none' : 'block'}}
        className={styles.autoUpdate}
        onClick={this.dismissNote}>
        <b>×</b>
        <Icon name='timer' /> <strong>{t('dashboard.next_update', this.formatTime())}</strong> {t('dashboard.auto_update')}
      </p>
    );
  }
}

export default CountdownTimer;
