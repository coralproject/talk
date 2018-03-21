import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'coral-ui';
import cn from 'classnames';

// TODO: (kiwi) Need to adapt CSS classes post refactor to match the rest.
import { name } from '../containers/CommentBox';
import styles from './CommentForm.css';

import t from 'coral-framework/services/i18n';
import DraftArea from '../containers/DraftArea';

/**
 * Common UI for Creating or Editing a Comment
 */
class CommentForm extends React.Component {
  static propTypes = {
    charCountEnable: PropTypes.bool.isRequired,
    maxCharCount: PropTypes.number,

    // Unique identifier for this form
    id: PropTypes.string,

    // render at start of button container (useful for extra buttons)
    buttonContainerStart: PropTypes.node,

    // render inside submit button
    submitText: PropTypes.node,

    // cStyle for enabled submit <coral-ui/Button>
    submitButtonCStyle: PropTypes.string,

    // return whether the submit button should be enabled for the provided
    // input (for reasons other than charCount)
    submitEnabled: PropTypes.func,

    // className to add to buttons
    submitButtonClassName: PropTypes.string,
    cancelButtonClassName: PropTypes.string,

    input: PropTypes.object.isRequired,
    onInputChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    state: PropTypes.string,
    loadingState: PropTypes.oneOf(['', 'loading', 'success', 'error']),
    registerHook: PropTypes.func,
    unregisterHook: PropTypes.func,
    isReply: PropTypes.bool,
    isEdit: PropTypes.bool,
    root: PropTypes.object.isRequired,
    comment: PropTypes.object,
  };
  static get defaultProps() {
    return {
      submitText: t('comment_box.post'),
      submitButtonCStyle: 'darkGrey',
      submitEnabled: () => true,
    };
  }

  onClickSubmit = () => {
    this.props.onSubmit();
  };

  getButtonClassName = () => {
    switch (this.props.loadingState) {
      case 'loading':
        return cn(`${name}-button-loading`, styles.buttonLoading);
      case 'success':
        return cn(`${name}-button-success`, styles.buttonSuccess);
      case 'error':
        return cn(`${name}-button-error`, styles.buttonError);
      default:
        return '';
    }
  };

  render() {
    const {
      maxCharCount,
      submitEnabled,
      cancelButtonClassName,
      submitButtonClassName,
      charCountEnable,
      input,
      loadingState,
      comment,
      root,
    } = this.props;

    const length = input.body.length;
    const isRespectingMaxCount = length =>
      charCountEnable && maxCharCount && length > maxCharCount;
    const disableSubmitButton =
      !length ||
      input.body.trim().length === 0 ||
      isRespectingMaxCount(length) ||
      !submitEnabled(input) ||
      loadingState === 'loading';
    const disableCancelButton = loadingState === 'loading';
    const disableTextArea = loadingState === 'loading';

    return (
      <div>
        <DraftArea
          root={root}
          comment={comment}
          id={this.props.id}
          input={input}
          onInputChange={this.props.onInputChange}
          disabled={disableTextArea}
          charCountEnable={this.props.charCountEnable}
          maxCharCount={this.props.maxCharCount}
          registerHook={this.props.registerHook}
          unregisterHook={this.props.unregisterHook}
          isReply={this.props.isReply}
          isEdit={this.props.isEdit}
        />
        <div className={cn(styles.buttonContainer, `${name}-button-container`)}>
          {this.props.buttonContainerStart}
          {typeof this.props.onCancel === 'function' && (
            <Button
              cStyle="darkGrey"
              className={cn(`${name}-cancel-button`, cancelButtonClassName)}
              onClick={this.props.onCancel}
              disabled={disableCancelButton}
            >
              {t('comment_box.cancel')}
            </Button>
          )}
          <Button
            cStyle={
              disableSubmitButton ? 'lightGrey' : this.props.submitButtonCStyle
            }
            className={cn(
              styles.button,
              `${name}-button`,
              submitButtonClassName,
              this.getButtonClassName()
            )}
            onClick={this.onClickSubmit}
            disabled={disableSubmitButton ? 'disabled' : ''}
          >
            {this.props.submitText}
          </Button>
        </div>
      </div>
    );
  }
}

export default CommentForm;
