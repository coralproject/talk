import {gql} from 'react-apollo';

const commentViewFragment = gql`
  fragment commentView on Comment {
    id
    body
    created_at
    status
    tags {
      name
    }
    user {
        id
        name: username
    }
    action_summaries {
      ...actionSummaryView
    }
  }
`;

const actionSummaryViewFragment = gql`
  fragment actionSummaryView on ActionSummary {
    __typename
    count
    current_user {
      id
      created_at
    }
  }
`;

export const fragment = gql`
  fragment Stream_root on RootQuery {
    comment(id: $commentId) @include(if: $hasComment) {
      ...commentView
      replyCount(excludeIgnored: $excludeIgnored)
      replies {
        ...commentView
      }
      parent {
        ...commentView
        replyCount(excludeIgnored: $excludeIgnored)
        replies {
          ...commentView
        }
      }
    }
    asset(id: $assetId, url: $assetUrl) {
      id
      title
      url
      closedAt
      created_at
      settings {
        moderation
        infoBoxEnable
        infoBoxContent
        premodLinksEnable
        questionBoxEnable
        questionBoxContent
        closeTimeout
        closedMessage
        charCountEnable
        charCount
        requireEmailConfirmation
      }
      lastComment {
        id
      }
      commentCount(excludeIgnored: $excludeIgnored)
      totalCommentCount(excludeIgnored: $excludeIgnored)
      comments(limit: 10, excludeIgnored: $excludeIgnored) {
        ...commentView
        replyCount(excludeIgnored: $excludeIgnored)
        replies(limit: 3, excludeIgnored: $excludeIgnored) {
            ...commentView
        }
      }
    }
    myIgnoredUsers {
      id,
      username,
    }
  }
  ${commentViewFragment}
  ${actionSummaryViewFragment}
`;
