import React from 'react';
import PropTypes from 'prop-types';
import { t } from 'plugin-api/beta/client/services';

/**
 * CheckToxicityHook adds hooks to the `commentBox`
 * that handles checking a comment for toxicity.
 */
export default class CheckToxicityHook extends React.Component {
  // checked signifies if we already sent a request with the `checkToxicity` set to true.
  checked = false;

  componentDidMount() {
    this.toxicityPreHook = this.props.registerHook('preSubmit', input => {
      // If we haven't check the toxicity yet, make sure to include `checkToxicity=true` in the mutation.
      // Otherwise post comment without checking the toxicity.
      if (!this.checked) {
        input.checkToxicity = true;
        this.checked = true;
      }
    });

    this.toxicityPostHook = this.props.registerHook('postSubmit', result => {
      const actions = result.createComment.actions;
      if (
        actions &&
        actions.some(
          ({ __typename, reason }) =>
            __typename === 'FlagAction' && reason === 'TOXIC_COMMENT'
        )
      ) {
        this.props.notify('error', t('talk-plugin-toxic-comments.still_toxic'));
      }

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

CheckToxicityHook.propTypes = {
  notify: PropTypes.func.isRequired,
  registerHook: PropTypes.func.isRequired,
  unregisterHook: PropTypes.func.isRequired,
};
