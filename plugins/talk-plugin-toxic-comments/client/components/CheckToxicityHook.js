import React from 'react';

export default class CheckToxicityHook extends React.Component {
  checked = false;

  componentDidMount() {
    this.toxicityPreHook = this.props.registerHook('preSubmit', (input) => {
      if (!this.checked) {
        input.checkToxicity = true;
        this.checked = true;
      }
    });

    this.toxicityPostHook = this.props.registerHook('postSubmit', () => {
      this.checked = false;
    });
  }

  componentWillUnmount() {
    this.props.unregisterHook(this.toxicityPreHook);
    this.props.unregisterHook(this.toxicityPostHook);
  }

  render() {
    return null;
  }
}
