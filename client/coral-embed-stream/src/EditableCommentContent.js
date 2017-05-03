import React, {PropTypes} from 'react';
import {CommentForm} from 'coral-plugin-commentbox/CommentBox';

import I18n from 'coral-framework/modules/i18n/i18n';
import translations from 'coral-framework/translations';
const lang = new I18n(translations);

/**
 * Renders a Comment's body in such a way that the end-user can edit it and save changes
 */
export class EditableCommentContent extends React.Component {

  // @TODO (bengo) make sure these are accurate wrt isRequired
  static propTypes = {

    // show notification to the user (e.g. for errors)
    addNotification: PropTypes.func.isRequired,
    asset: PropTypes.shape({
      settings: PropTypes.shape({
        charCountEnable: PropTypes.bool,
      }),
    }).isRequired,

    // comment that is being edited
    comment: PropTypes.shape({
      body: PropTypes.string
    }).isRequired,

    // logged in user
    currentUser: PropTypes.shape({
      id: PropTypes.string.isRequired
    }),
    maxCharCount: PropTypes.number,

    // edit a comment, passed {{ body }}
    editComment: React.PropTypes.func,

    // called when editing should be stopped
    stopEditing: React.PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.editComment = this.editComment.bind(this);
  }
  async editComment(edit) {
    const {editComment, addNotification, stopEditing} = this.props;
    if (typeof editComment !== 'function') {return;}
    let response;
    let successfullyEdited = false;
    try {
      response = await editComment(edit);
      const errors = (response && response.data && response.data.editComment)
        ? response.data.editComment.errors
        : null;
      if (errors && (errors.length === 1)) {
        throw errors[0];
      }
      successfullyEdited = true;
    } catch (error) {
      if (error.translation_key) {
        addNotification('error', lang.t(error.translation_key) || error.translation_key);
      } else if (error.networkError) {
        addNotification('error', lang.t('error.networkError'));
      } else {
        throw error;
      }
    }
    if (successfullyEdited && typeof stopEditing === 'function') {
      stopEditing();
    }
  }
  stopEditing() {
    this.setState({resetCounter: this.state.resetCounter + 1});
  }
  render() {
    const originalBody = this.props.comment.body;
    return (
      <div style={{marginBottom: '10px'}}>
        <CommentForm
          defaultValue={this.props.comment.body}
          charCountEnable={this.props.asset.settings.charCountEnable}
          maxCharCount={this.props.maxCharCount}
          saveCommentEnabled={(comment) => {

            // should be disabled if user hasn't actually changed their
            // original comment
            return comment.body !== originalBody;
          }}
          saveComment={this.editComment}
          bodyLabel={'Edit this comment' /* @TODO (bengo) i18n */}
          bodyPlaceholder=""
          submitText={'Save changes' /* @TODO (bengo) i18n */}
          saveButtonCStyle="green"
        />
      </div>
    );
  }
}
