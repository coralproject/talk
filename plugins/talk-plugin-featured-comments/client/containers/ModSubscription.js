import React from 'react';
import { gql } from 'react-apollo';
import { connect } from 'react-redux';
import Comment from 'coral-admin/src/routes/Moderation/containers/Comment';
import { getDefinitionName } from 'coral-framework/utils';
import truncate from 'lodash/truncate';
import t from 'coral-framework/services/i18n';

function prepareNotificationText(text) {
  return truncate(text, { length: 50 }).replace('\n', ' ');
}

class ModSubscription extends React.Component {
  subscriptions = null;

  componentWillMount() {
    const configs = [
      {
        document: COMMENT_FEATURED_SUBSCRIPTION,
        variables: {
          assetId: this.props.data.variables.asset_id,
        },
        updateQuery: (
          prev,
          { subscriptionData: { data: { commentFeatured: { user, comment } } } }
        ) => {
          const notifyText =
            this.props.user.id === user.id
              ? ''
              : t(
                  'talk-plugin-featured-comments.notify_featured',
                  user.username,
                  prepareNotificationText(comment.body)
                );
          return this.props.handleCommentChange(prev, comment, notifyText);
        },
      },
      {
        document: COMMENT_UNFEATURED_SUBSCRIPTION,
        variables: {
          assetId: this.props.data.variables.asset_id,
        },
        updateQuery: (
          prev,
          {
            subscriptionData: {
              data: { commentUnfeatured: { user, comment } },
            },
          }
        ) => {
          const notify =
            this.props.user.id === user.id
              ? ''
              : t(
                  'talk-plugin-featured-comments.notify_unfeatured',
                  user.username,
                  prepareNotificationText(comment.body)
                );
          return this.props.handleCommentChange(prev, comment, notify);
        },
      },
    ];
    this.subscriptions = configs.map(config =>
      this.props.data.subscribeToMore(config)
    );
  }

  componentWillUnmount() {
    this.subscriptions.forEach(unsubscribe => unsubscribe());
  }

  render() {
    return null;
  }
}

const COMMENT_FEATURED_SUBSCRIPTION = gql`
  subscription CommentFeatured($assetId: ID){
    commentFeatured(asset_id: $assetId) {
      comment {
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
      user {
        id
        username
      }
    }
  }
  ${Comment.fragments.comment}
`;

const COMMENT_UNFEATURED_SUBSCRIPTION = gql`
  subscription CommentUnfeatured($assetId: ID){
    commentUnfeatured(asset_id: $assetId){
      comment {
        ...${getDefinitionName(Comment.fragments.comment)}
      }
      user {
        id
        username
      }
    }
  }
  ${Comment.fragments.comment}
`;

const mapStateToProps = state => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, null)(ModSubscription);
