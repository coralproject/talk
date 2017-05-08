import React, {PropTypes} from 'react';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from 'coral-framework/translations';

const lang = new I18n(translations);

/**
 * Countdown the number of seconds until a given Date
 */
export class CountdownSeconds extends React.Component {
  static propTypes = {
    until: PropTypes.instanceOf(Date).isRequired,
    classNameForMsRemaining: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.countdownInterval = null;
  }
  componentDidMount() {
    const {until} = this.props;
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
    const {until, classNameForMsRemaining} = this.props;
    const msRemaining = until - now;
    const secRemaining = msRemaining / 1000;
    const wholeSecRemaining = Math.floor(secRemaining);
    const plural = secRemaining !== 1;
    const units = lang.t(plural ? 'editComment.secondsPlural' : 'editComment.second');
    let classFromProp;
    if (typeof classNameForMsRemaining === 'function') {
      classFromProp = classNameForMsRemaining(msRemaining);
    }
    return (
      <span className={classFromProp}>
        {`${wholeSecRemaining} ${units}`}
      </span>
    );
  }
}
