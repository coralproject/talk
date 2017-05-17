import React, {PropTypes} from 'react';
import {Button} from 'coral-ui';
import classnames from 'classnames';
import Slot from 'coral-framework/components/Slot';

import {name} from './CommentBox';

import t from 'coral-i18n/services/i18n';

/**
 * Common UI for Creating or Editing a Comment
 */
export class CommentForm extends React.Component {
  static propTypes = {

    // Initial value for underlying comment body textarea
    defaultValue: PropTypes.string,
    charCountEnable: PropTypes.bool.isRequired,
    maxCharCount: PropTypes.number,
    cancelButtonClicked: PropTypes.func,

    // Save the comment in the form.
    // Will be passed { body: String }
    saveComment: PropTypes.func.isRequired,

    // DOM ID for form input that edits comment body
    bodyInputId: PropTypes.string,

    // screen reader label for input that edits comment body
    bodyLabel: PropTypes.string,

    // Placeholder for input that edits comment body
    bodyPlaceholder: PropTypes.string,

    // render at start of button container (useful for extra buttons)
    buttonContainerStart: PropTypes.node,

    // render inside submit button
    submitText: PropTypes.node,

    styles: PropTypes.shape({
      textarea: PropTypes.string
    }),

    // cStyle for enabled save <coral-ui/Button>
    saveButtonCStyle: PropTypes.string,

    // return whether the save button should be enabled for the provided
    // comment ({ body }) (for reasons other than charCount)
    saveCommentEnabled: PropTypes.func,

    // className to add to buttons
    buttonClass: PropTypes.string,
  }
  static get defaultProps() {
    return {
      bodyLabel: t('comment_box.comment'),
      bodyPlaceholder: t('comment_box.comment'),
      submitText: t('comment_box.post'),
      saveButtonCStyle: 'darkGrey',
      saveCommentEnabled: () => true,
    };
  }
  constructor(props) {
    super(props);
    this.onBodyChange = this.onBodyChange.bind(this);
    this.onClickSubmit = this.onClickSubmit.bind(this);
    this.state = {
      body: props.defaultValue || ''
    };
  }
  onBodyChange(e) {
    this.setState({body: e.target.value});
  }
  onClickSubmit(e) {
    e.preventDefault();
    const {saveComment} = this.props;
    const {body} = this.state;
    saveComment({body});
  }
  render() {
    const {maxCharCount, styles, saveCommentEnabled, buttonClass, charCountEnable} = this.props;

    const body = this.state.body;
    const length = body.length;
    const isRespectingMaxCount = (length) => charCountEnable && maxCharCount && length > maxCharCount;
    const disablePostComment = !length || isRespectingMaxCount(length) || !saveCommentEnabled({body});

    return <div>
      <div className={`${name}-container`}>
        <label
          htmlFor={this.props.bodyInputId}
          className="screen-reader-text"
          aria-hidden={true}>
          {this.props.bodyLabel}
        </label>
        <textarea
          style={styles && styles.textarea}
          className={`${name}-textarea`}
          value={this.state.body}
          placeholder={this.props.bodyPlaceholder}
          id={this.props.bodyInputId}
          onChange={this.onBodyChange}
          rows={3}/>
        <Slot fill='commentInputArea' />
      </div>
      {
        this.props.charCountEnable &&
        <div className={`${name}-char-count ${length > maxCharCount ? `${name}-char-max` : ''}`}>
          {maxCharCount && `${maxCharCount - length} ${t('comment_box.characters_remaining')}`}
        </div>
      }
      <div className={`${name}-button-container`}>
        { this.props.buttonContainerStart }
        {
          typeof this.props.cancelButtonClicked === 'function' && (
            <Button
              cStyle='darkGrey'
              className={classnames(`${name}-cancel-button`, buttonClass)}
              onClick={this.props.cancelButtonClicked}>
              {t('comment_box.cancel')}
            </Button>
          )
        }
        <Button
          cStyle={disablePostComment ? 'lightGrey' : this.props.saveButtonCStyle}
          className={classnames(`${name}-button`, buttonClass)}
          onClick={this.onClickSubmit}
          disabled={disablePostComment ? 'disabled' : ''}>
          {this.props.submitText}
        </Button>
      </div>
    </div>;
  }
}
