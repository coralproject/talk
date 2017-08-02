import React from 'react';
import {gql} from 'react-apollo';
import {connect} from 'react-redux';
import Comment from 'coral-admin/src/routes/Moderation/containers/Comment';
import {handleCommentChange} from 'coral-admin/src/graphql/utils';
import {getDefinitionName} from 'coral-framework/utils';
import truncate from 'lodash/truncate';
import t from 'coral-framework/services/i18n';

function prepareNotificationText(text) {
  return truncate(text, {length: 50}).replace('\n', ' ');
}

class ModSubscription extends React.Component {
  unsubscribe = null;

  componentWillMount() {
    this.unsubscribe = this.props.data.subscribeToMore({
      document: COMMENT_FEATURED_SUBSCRIPTION,
      variables: {
        assetId: this.props.data.variables.asset_id,
      },
      updateQuery: (prev, {subscriptionData: {data: {commentFeatured: comment}}}) => {
        const sort = this.props.data.variables.sort;
        const user = comment.status_history[comment.status_history.length - 1].assigned_by;
        const notify = {
          activeQueue: this.props.activeTab,
          text: t(
            'talk-plugin-featured-comments.notify_featured',
            user.username,
            prepareNotificationText(comment.body)
          ),
          anyQueue: true,
        };
        return handleCommentChange(prev, comment, sort, notify);
      },
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return null;
  }
}

const COMMENT_FEATURED_SUBSCRIPTION = gql`
  subscription CommentFeatured($assetId: ID){
    commentFeatured(asset_id: $assetId){
      ...${getDefinitionName(Comment.fragments.comment)}
      status_history {
        type
        created_at
        assigned_by {
          id
          username
        }
      }
    }
  }
  ${Comment.fragments.comment}
`;

const mapStateToProps = (state) => ({
  sortOrder: state.moderation.toJS().sortOrder,
});

export default connect(mapStateToProps, null)(ModSubscription);
