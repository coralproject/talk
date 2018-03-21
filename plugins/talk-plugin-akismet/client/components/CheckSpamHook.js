import React from 'react';
import PropTypes from 'prop-types';
import { t } from 'plugin-api/beta/client/services';

/**
 * CheckSpamHook adds hooks to the `commentBox`
 * that handles checking a comment for spam.
 */
export default class CheckSpamHook extends React.Component {
  // checked signifies if we already sent a request with the `checkSpam` set to true.
  checked = false;

  componentDidMount() {
    this.spamPreHook = this.props.registerHook('preSubmit', input => {
      // If we haven't check the spam yet, make sure to include `checkSpam=true` in the mutation.
      // Otherwise post comment without checking the spam.
      if (!this.checked) {
        this.checked = true;
        return {
          ...input,
          checkSpam: true,
        };
      }
    });

    this.spamPostHook = this.props.registerHook('postSubmit', result => {
      const actions = result.createComment.actions;
      if (
        actions &&
        actions.some(
          ({ __typename, reason }) =>
            __typename === 'FlagAction' && reason === 'SPAM_COMMENT'
        )
      ) {
        this.props.notify('error', t('talk-plugin-akismet.still_spam'));
      }

      // Reset `checked` after comment was successfully posted.
      this.checked = false;
    });
  }

  componentWillUnmount() {
    this.props.unregisterHook(this.spamPreHook);
    this.props.unregisterHook(this.spamPostHook);
  }

  render() {
    return null;
  }
}

CheckSpamHook.propTypes = {
  notify: PropTypes.func.isRequired,
  registerHook: PropTypes.func,
  unregisterHook: PropTypes.func,
};
