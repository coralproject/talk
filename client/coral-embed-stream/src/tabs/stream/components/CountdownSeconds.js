import React from 'react';
import PropTypes from 'prop-types';
import t from 'coral-framework/services/i18n';

/**
 * Countdown the number of seconds until a given Date
 */
export class CountdownSeconds extends React.Component {
  static propTypes = {
    until: PropTypes.instanceOf(Date).isRequired,
    classNameForMsRemaining: PropTypes.func,
  };
  constructor(props) {
    super(props);
    this.countdownInterval = null;
  }
  componentDidMount() {
    const { until } = this.props;
    const now = new Date();
    if (until - now > 0) {
      this.countdownInterval = setInterval(() => {
        // re-render
        this.forceUpdate();
      }, 1000);
    }
  }
  componentWillUnmount() {
    if (this.countdownInterval) {
      this.countdownInterval = clearInterval(this.countdownInterval);
    }
  }
  render() {
    const now = new Date();
    const { until, classNameForMsRemaining } = this.props;
    const msRemaining = until - now;
    const secRemaining = msRemaining / 1000;
    const minRemaining = secRemaining / 60;
    const secToMinRemaining = secRemaining % 60;
    const wholeMinRemaining = Math.floor(minRemaining);
    const wholeSecRemaining = Math.floor(secToMinRemaining);
    const secUnit = t(
      wholeSecRemaining !== 1
        ? 'edit_comment.seconds_plural'
        : 'edit_comment.second'
    );
    const minUnit = t(
      wholeMinRemaining !== 1
        ? 'edit_comment.minutes_plural'
        : 'edit_comment.minute'
    );
    let classFromProp;
    if (typeof classNameForMsRemaining === 'function') {
      classFromProp = classNameForMsRemaining(msRemaining);
    }
    const text =
      wholeMinRemaining > 0
        ? `${wholeMinRemaining} ${minUnit} ${wholeSecRemaining} ${secUnit}`
        : `${wholeSecRemaining} ${secUnit}`;

    return <span className={classFromProp}>{text}</span>;
  }
}
