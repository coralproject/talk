import React from 'react';
import PropTypes from 'prop-types';
import ReactRecaptcha from 'react-recaptcha';

class Recaptcha extends React.Component {
  static contextTypes = {
    store: PropTypes.object,
  };

  ref = null;

  handleRef = ref => {
    this.ref = ref;
  };

  reset = () => this.ref.reset();

  getSiteKey() {
    // This should be fine because it's static and will never change.
    // Prefer this to connect HOC because wie expose the instance method
    // `reset`
    return this.context.store.getState().config.static.TALK_RECAPTCHA_PUBLIC;
  }

  render() {
    return (
      <ReactRecaptcha
        ref={this.handleRef}
        sitekey={this.getSiteKey()}
        render={this.props.render}
        theme={this.props.theme}
        onloadCallback={this.props.onLoad}
        verifyCallback={this.props.onVerify}
        size={this.props.size}
        className={this.props.className}
      />
    );
  }
}

Recaptcha.defaultProps = {
  render: 'explicit',
  theme: 'light',
  size: 'normal',
};

Recaptcha.propTypes = {
  onLoad: PropTypes.func,
  onVerify: PropTypes.func.isRequired,
  theme: PropTypes.string,
  render: PropTypes.string,
  size: PropTypes.string,
  className: PropTypes.string,
};

export default Recaptcha;
