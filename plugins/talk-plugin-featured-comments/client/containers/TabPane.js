import React from 'react';
import { bindActionCreators } from 'redux';
import { compose, gql } from 'react-apollo';
import TabPane from '../components/TabPane';
import { withFragments, connect } from 'plugin-api/beta/client/hocs';
import Comment from '../containers/Comment';
import { notify } from 'plugin-api/beta/client/actions/notification';
import { viewComment } from 'coral-embed-stream/src/actions/stream';
import {
  appendNewNodes,
  getDefinitionName,
} from 'plugin-api/beta/client/utils';
import update from 'immutability-helper';

class TabPaneContainer extends React.Component {
  loadMore = () => {
    return this.props.data.fetchMore({
      query: LOAD_MORE_QUERY,
      variables: {
        limit: 5,
        cursor: this.props.asset.featuredComments.endCursor,
        asset_id: this.props.asset.id,
        sortOrder: this.props.data.variables.sortOrder,
        sortBy: this.props.data.variables.sortBy,
        excludeIgnored: this.props.data.variables.excludeIgnored,
      },
      updateQuery: (previous, { fetchMoreResult: { comments } }) => {
        const updated = update(previous, {
          asset: {
            featuredComments: {
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
    return <TabPane {...this.props} loadMore={this.loadMore} />;
  }
}

const LOAD_MORE_QUERY = gql`
  query TalkFeaturedComments_LoadMoreComments(
    $limit: Int = 5
    $cursor: Cursor
    $asset_id: ID
    $sortOrder: SORT_ORDER
    $sortBy: SORT_COMMENTS_BY
    $excludeIgnored: Boolean
  ) {
    comments(
      query: {
        limit: $limit
        cursor: $cursor
        tags: ["FEATURED"]
        asset_id: $asset_id,
        sortOrder: $sortOrder
        sortBy: $sortBy
        excludeIgnored: $excludeIgnored
      }
    ) {
      nodes {
        ...${getDefinitionName(Comment.fragments.comment)}
      }
      hasNextPage
      startCursor
      endCursor
    }
  }
  ${Comment.fragments.comment}
`;

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      viewComment,
      notify,
    },
    dispatch
  );

const enhance = compose(
  connect(null, mapDispatchToProps),
  withFragments({
    root: gql`
      fragment TalkFeaturedComments_TabPane_root on RootQuery {
        __typename
        ...${getDefinitionName(Comment.fragments.root)}
      }
      ${Comment.fragments.root}
    `,
    asset: gql`
      fragment TalkFeaturedComments_TabPane_asset on Asset {
        id
        featuredComments: comments(
          query: {
            tags: ["FEATURED"]
            sortOrder: $sortOrder
            sortBy: $sortBy
            excludeIgnored: $excludeIgnored
          }
          deep: true
        ) @skip(if: $hasComment) {
          nodes {
            ...${getDefinitionName(Comment.fragments.comment)}
          }
          hasNextPage
          startCursor
          endCursor
        }
        ...${getDefinitionName(Comment.fragments.asset)}
      }
      ${Comment.fragments.comment}
      ${Comment.fragments.asset}
    `,
  })
);

export default enhance(TabPaneContainer);
