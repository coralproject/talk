import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, gql } from 'react-apollo';
import CommentHistory from '../components/CommentHistory';
import Comment from './Comment';
import { withFragments, withFetchMore } from 'coral-framework/hocs';

import { appendNewNodes } from 'plugin-api/beta/client/utils';
import update from 'immutability-helper';
import { getDefinitionName } from 'coral-framework/utils';

class CommentHistoryContainer extends Component {
  navigate = url => {
    this.context.pym.sendMessage('navigate', url);
  };

  loadMore = () => {
    return this.props.fetchMore({
      query: LOAD_MORE_QUERY,
      variables: {
        limit: 5,
        cursor: this.props.root.me.comments.endCursor,
      },
      updateQuery: (
        previous,
        {
          fetchMoreResult: {
            me: { comments },
          },
        }
      ) => {
        const updated = update(previous, {
          me: {
            comments: {
              nodes: {
                $apply: nodes => appendNewNodes(nodes, comments.nodes),
              },
              hasNextPage: { $set: comments.hasNextPage },
              endCursor: { $set: comments.endCursor },
            },
          },
        });
        return updated;
      },
    });
  };

  render() {
    return (
      <CommentHistory
        comments={this.props.root.me.comments}
        root={this.props.root}
        loadMore={this.loadMore}
        navigate={this.navigate}
      />
    );
  }
}

CommentHistoryContainer.contextTypes = {
  pym: PropTypes.object,
};

CommentHistoryContainer.propTypes = {
  root: PropTypes.object,
  fetchMore: PropTypes.func.isRequired,
};

const LOAD_MORE_QUERY = gql`
  query TalkEmbedStream_CommentHistory_LoadMoreComments($limit: Int, $cursor: Cursor) {
    me {
      comments(query: { limit: $limit, cursor: $cursor }) {
        nodes {
          ...${getDefinitionName(Comment.fragments.comment)}
        }
        endCursor
        hasNextPage
      }
    }
  }
  ${Comment.fragments.comment}
`;

const withCommentHistoryFragments = withFragments({
  root: gql`
    fragment TalkEmbedStream_CommentHistory on RootQuery {
      me {
        comments(query: {limit: 10}) {
          nodes {
            ...${getDefinitionName(Comment.fragments.comment)}
          }
          endCursor
          hasNextPage
        }
      }
    }
    ${Comment.fragments.comment}
  `,
});

const mapStateToProps = state => ({
  currentUser: state.auth.user,
});

export default compose(
  connect(
    mapStateToProps,
    null
  ),
  withCommentHistoryFragments,
  withFetchMore
)(CommentHistoryContainer);
