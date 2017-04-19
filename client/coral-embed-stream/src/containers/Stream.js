import React from 'react';
import {gql} from 'react-apollo';
import Stream from '../components/Stream';
import {NEW_COMMENT_COUNT_POLL_INTERVAL} from '../constants/stream';

export default class StreamContainer extends React.Component {
  getCounts = ({asset_id, limit, sort}) => {
    return this.props.data.fetchMore({
      query: LOAD_COMMENT_COUNTS_QUERY,
      variables: {
        asset_id,
        limit,
        sort,
        excludeIgnored: data.variables.excludeIgnored,
      },
      updateQuery: (oldData, {fetchMoreResult:{asset}}) => {
        return {
          ...oldData,
          asset: {
            ...oldData.asset,
            commentCount: asset.commentCount
          }
        };
      }
    });
  };

  // handle paginated requests for more Comments pertaining to the Asset
  loadMore = ({limit, cursor, parent_id = null, asset_id, sort}, newComments) => {
    return this.props.data.fetchMore({
      query: LOAD_MORE_QUERY,
      variables: {
        limit, // how many comments are we returning
        cursor, // the date of the first/last comment depending on the sort order
        parent_id, // if null, we're loading more top-level comments, if not, we're loading more replies to a comment
        asset_id, // the id of the asset we're currently on
        sort, // CHRONOLOGICAL or REVERSE_CHRONOLOGICAL
        excludeIgnored: data.variables.excludeIgnored,
      },
      updateQuery: (oldData, {fetchMoreResult:{new_top_level_comments}}) => {
        let updatedAsset;

        if (!isNil(oldData.comment)) { // loaded replies on a highlighted (permalinked) comment

          let comment = {};
          if (oldData.comment && oldData.comment.parent) {

            // put comments (replies) onto the oldData.comment.parent object
            // the initial comment permalinked was a reply
            const uniqReplies = uniqBy([...new_top_level_comments, ...oldData.comment.parent.replies], 'id');
            comment.parent = {...oldData.comment.parent, replies: sortBy(uniqReplies, 'created_at')};
          } else if (oldData.comment) {

            // put the comments (replies) directly onto oldData.comment
            // the initial comment permalinked was a top-level comment
            const uniqReplies = uniqBy([...new_top_level_comments, ...oldData.comment.replies], 'id');
            comment.replies = sortBy(uniqReplies, 'created_at');
          }

          updatedAsset = {
            ...oldData,
            comment: {
              ...oldData.comment,
              ...comment
            }
          };

        } else if (parent_id) { // If loading more replies

          updatedAsset = {
            ...oldData,
            asset: {
              ...oldData.asset,
              comments: oldData.asset.comments.map(comment => {

                // since the dipslayed replies and the returned replies can overlap,
                // pull out the unique ones.
                const uniqueReplies = uniqBy([...new_top_level_comments, ...comment.replies], 'id');

                // since we just gave the returned replies precedence, they're now out of order.
                // resort according to date.
                return comment.id === parent_id
                  ? {...comment, replies: sortBy(uniqueReplies, 'created_at')}
                  : comment;
              })
            }
          };
        } else { // If loading more top-level comments

          updatedAsset = {
            ...oldData,
            asset: {
              ...oldData.asset,
              comments: newComments ? [...new_top_level_comments.reverse(), ...oldData.asset.comments]
                : [...oldData.asset.comments, ...new_top_level_comments]
            }
          };
        }

        return updatedAsset;
      }
    });
  };

  componentDidMount() {
    this.countPoll = setInterval(() => {
      const {asset} = this.props.data;
      this.props.getCounts({
        asset_id: asset.id,
        limit: asset.comments.length,
        sort: 'REVERSE_CHRONOLOGICAL'
      });
    }, NEW_COMMENT_COUNT_POLL_INTERVAL);
  }

  componentWillUnmount() {
    clearInterval(this.countPoll);
  }

  render() {
    return <Stream {...this.props} loadMore={this.loadMore} getCounts={this.getCounts}/>;
  }
}

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

StreamContainer.fragments = {
  root: gql`
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
  `,
};
