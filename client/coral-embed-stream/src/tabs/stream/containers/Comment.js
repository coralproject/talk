import { gql, compose } from 'react-apollo';
import React from 'react';
import Comment from '../components/Comment';
import { withFragments } from 'coral-framework/hocs';
import { getSlotFragmentSpreads } from 'coral-framework/utils';
import { withSetCommentStatus } from 'coral-framework/graphql/mutations';
import { getDefinitionName } from 'coral-framework/utils';
import CommentBox from './CommentBox';
import ReplyBox from './ReplyBox';
import {
  THREADING_LEVEL,
  REPLY_COMMENTS_LOAD_DEPTH,
} from '../../../constants/stream';
import hoistStatics from 'recompose/hoistStatics';
import { nest } from '../../../graphql/utils';

const slots = [
  'streamQuestionArea',
  'commentInputDetailArea',
  'commentInfoBar',
  'commentActions',
  'commentReactions',
  'commentAvatar',
  'commentAuthorName',
  'commentAuthorTags',
  'commentTimestamp',
  'commentTombstone',
  'commentContent',
];

/**
 * withAnimateEnter is a HOC that passes a property `animateEnter` to the
 * underlying BaseComponent. It must be a direct child of a `TransitionGroup`
 * from https://github.com/reactjs/react-transition-group and as such must
 * be the uppermost HOC applied to the BaseComponent.
 */
const withAnimateEnter = hoistStatics(BaseComponent => {
  class WithAnimateEnter extends React.Component {
    state = {
      animateEnter: false,
    };

    componentWillEnter(callback) {
      callback();
      const userId = this.props.currentUser ? this.props.currentUser.id : null;
      if (this.props.comment.id.indexOf('pending') >= 0) {
        return;
      }
      if (userId && this.props.comment.user.id === userId) {
        // This comment was just added by currentUser.
        if (
          Date.now() - Number(new Date(this.props.comment.created_at)) <
          30 * 1000
        ) {
          return;
        }
      }
      this.setState({ animateEnter: true });
    }

    render() {
      return (
        <BaseComponent {...this.props} animateEnter={this.state.animateEnter} />
      );
    }
  }
  return WithAnimateEnter;
});

export const singleCommentFragment = gql`
  fragment CoralEmbedStream_Comment_SingleComment on Comment {
    id
    body
    created_at
    status
    replyCount
    tags {
      tag {
        name
      }
    }
    user {
      id
      username
    }
    status_history {
      type
    }
    action_summaries {
      __typename
      count
      current_user {
        id
      }
    }
    editing {
      edited
      editableUntil
    }
    ${getSlotFragmentSpreads(slots, 'comment')}
    ...${getDefinitionName(CommentBox.fragments.comment)}
    ...${getDefinitionName(ReplyBox.fragments.comment)}
  }
  ${CommentBox.fragments.comment}
  ${ReplyBox.fragments.comment}
`;

const withCommentFragments = withFragments({
  root: gql`
    fragment CoralEmbedStream_Comment_root on RootQuery {
      me {
        ignoredUsers {
          id
        }
      }
      ${getSlotFragmentSpreads(slots, 'root')}
      ...${getDefinitionName(CommentBox.fragments.root)}
      ...${getDefinitionName(ReplyBox.fragments.root)}
    }
    ${CommentBox.fragments.root}
    ${ReplyBox.fragments.root}
    `,
  asset: gql`
    fragment CoralEmbedStream_Comment_asset on Asset {
      __typename
      id
      ${getSlotFragmentSpreads(slots, 'asset')}
    }
    `,
  comment: gql`
    fragment CoralEmbedStream_Comment_comment on Comment {
      ...CoralEmbedStream_Comment_SingleComment
      ${nest(
        `
        replies(query: {limit: ${REPLY_COMMENTS_LOAD_DEPTH}, excludeIgnored: $excludeIgnored}) {
          nodes {
            ...CoralEmbedStream_Comment_SingleComment
            ...nest
          }
          hasNextPage
          startCursor
          endCursor
        }
      `,
        THREADING_LEVEL
      )}
    }
    ${singleCommentFragment}
  `,
});

const enhance = compose(
  withAnimateEnter,
  withCommentFragments,
  withSetCommentStatus
);

export default enhance(Comment);
