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

const fields = `
  status
  actions {
    __typename
    created_at
  }
  status_history {
    type
    assigned_by {
      id
    }
    created_at
  }
  updated_at
  created_at
`;

const COMMENT_FEATURED_SUBSCRIPTION = gql`
  subscription TalkFeaturedComments_Indicator_CommentFeatured {
    commentFeatured {
      comment {
        ${fields}
      }
    }
  }
`;

const COMMENT_UNFEATURED_SUBSCRIPTION = gql`
  subscription TalkFeaturedComments_Indicator_CommentUnfeatured {
    commentUnfeatured {
      comment {
        ${fields}
      }
    }
  }
`;

export default ModIndicatorSubscription;
