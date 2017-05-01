import React, {PropTypes} from 'react';
import {CommentForm} from 'coral-plugin-commentbox/CommentBox';

/**
 * Renders a Comment's body in such a way that the end-user can edit it and save changes
 */
export class EditableCommentContent extends React.Component {

  // @TODO (bengo) make sure these are accurate wrt isRequired
  static propTypes = {

    // show notification to the user (e.g. for errors)
    addNotification: PropTypes.func.isRequired,
    asset: PropTypes.shape({
      id: PropTypes.string.isRequired,
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

    parentId: PropTypes.string,
  }
  constructor(props) {
    super(props);
  }
  render() {
    const saveComment = function () {
    };
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
          saveComment={saveComment}
          bodyLabel={'Edit this comment' /* @TODO (bengo) i18n */}
          bodyPlaceholder=""
          submitText={'Save changes' /* @TODO (bengo) i18n */}
          saveButtonCStyle="green"
        />
      </div>
    );
  }
}
