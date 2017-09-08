import React from 'react';

/**
 * CheckToxicityHook adds hooks to the `commentBox`
 * that handles checking a comment for toxicity.
 */
export default class CheckToxicityHook extends React.Component {

  // checked signifies if we already sent a request with the `checkToxicity` set to true.
  checked = false;

  componentDidMount() {
    this.toxicityPreHook = this.props.registerHook('preSubmit', (input) => {

      // If we haven't check the toxicity yet, make sure to include `checkToxicity=true` in the mutation.
      // Otherwise post comment without checking the toxicity.
      if (!this.checked) {
        input.checkToxicity = true;
        this.checked = true;
      }
    });

    this.toxicityPostHook = this.props.registerHook('postSubmit', () => {

      // Reset `checked` after comment was successfully posted.
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
