import React from 'react';
import { gql } from 'react-apollo';

class ModIndicatorSubscription extends React.Component {
  subscriptions = null;

  componentWillMount() {
    const configs = [
      {
        document: COMMENT_FEATURED_SUBSCRIPTION,
        updateQuery: (
          prev,
          { subscriptionData: { data: { commentFeatured: { comment } } } }
        ) => {
          return this.props.handleCommentChange(prev, comment);
        },
      },
      {
        document: COMMENT_UNFEATURED_SUBSCRIPTION,
        updateQuery: (
          prev,
          { subscriptionData: { data: { commentUnfeatured: { comment } } } }
        ) => {
          return this.props.handleCommentChange(prev, comment);
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
  subscription TalkFeaturedComments_Indicator_CommentFeatured {
    commentFeatured {
      comment {
        status
        actions {
          __typename
          ... on FlagAction {
            reason
          }
          user {
            id
            role
          }
        }
        status_history {
          type
          assigned_by {
            id
          }
        }
      }
    }
  }
`;

const COMMENT_UNFEATURED_SUBSCRIPTION = gql`
  subscription TalkFeaturedComments_Indicator_CommentUnfeatured {
    commentUnfeatured {
      comment {
        status
        actions {
          __typename
          ... on FlagAction {
            reason
          }
          user {
            id
            role
          }
        }
        status_history {
          type
          assigned_by {
            id
          }
        }
      }
    }
  }
`;

export default ModIndicatorSubscription;
