import React from 'react';

import t from 'coral-framework/services/i18n';

// Render in place of a Comment when the author of the comment is <action>
class CommentTombstone extends React.Component {
  getCopy() {
    const {action} = this.props;

    switch (action) {
    case 'ignore':
      return t('framework.comment_is_ignored');
    case 'reject':
      return t('framework.comment_is_rejected');
    default :
      return t('framework.comment_is_hidden');
    }
  }

  render() {
    return (
      <div>
        <hr aria-hidden={true} />
        <p style={{
          backgroundColor: '#F0F0F0',
          textAlign: 'center',
          padding: '1em',
          color: '#3E4F71',
        }}>
          {this.getCopy()}
        </p>
      </div>
    );
  }
}

export default CommentTombstone;
