import {gql, compose} from 'react-apollo';
import React from 'react';
import Comment from '../components/Comment';
import {withFragments} from 'coral-framework/hocs';
import {getSlotFragmentSpreads} from 'coral-framework/utils';
import hoistStatics from 'recompose/hoistStatics';

const slots = [
  'streamQuestionArea',
  'commentInputArea',
  'commentInputDetailArea',
  'commentInfoBar',
  'commentActions',
  'commentContent',
  'commentReactions',
  'commentAvatar'
];

const withAnimateEnter = hoistStatics((BaseComponent) => {
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
        if (Date.now() - Number(new Date(this.props.comment.created_at)) < 30 * 1000) {
          return;
        }
      }
      this.setState({animateEnter: true});
    }

    render() {
      return <BaseComponent
        {...this.props}
        animateEnter={this.state.animateEnter}
      />;
    }
  }
  return WithAnimateEnter;
});

const withCommentFragments = withFragments({
  root: gql`
    fragment CoralEmbedStream_Comment_root on RootQuery {
      __typename
      ${getSlotFragmentSpreads(slots, 'root')}
    }
    `,
  asset: gql`
    fragment CoralEmbedStream_Comment_asset on Asset {
      __typename
      ${getSlotFragmentSpreads(slots, 'asset')}
    }
    `,
  comment: gql`
    fragment CoralEmbedStream_Comment_comment on Comment {
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
    }
  `
});

const enhance = compose(
  withAnimateEnter,
  withCommentFragments,
);

export default enhance(Comment);
