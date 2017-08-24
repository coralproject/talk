import React from 'react';
import {bindActionCreators} from 'redux';
import {compose, gql} from 'react-apollo';
import TabPane from '../components/TabPane';
import {withFragments, connect} from 'plugin-api/beta/client/hocs';
import Comment from '../containers/Comment';
import {addNotification} from 'plugin-api/beta/client/actions/notification';
import {viewComment} from 'coral-embed-stream/src/actions/stream';
import {getDefinitionName} from 'plugin-api/beta/client/utils';
import update from 'immutability-helper';

class TabPaneContainer extends React.Component {

  loadMore = () => {
    return this.props.data.fetchMore({
      query: LOAD_MORE_QUERY,
      variables: {
        limit: 5,
        cursor: this.props.asset.featuredComments.endCursor,
        asset_id: this.props.asset.id,
        sort: this.props.data.variables.sort,
        sortBy: this.props.data.variables.sortBy,
        excludeIgnored: this.props.data.variables.excludeIgnored,
      },
      updateQuery: (previous, {fetchMoreResult:{comments}}) => {
        const updated = update(previous, {
          asset: {
            featuredComments: {
              nodes: {
                $push: comments.nodes,
              },
              hasNextPage: {$set: comments.hasNextPage},
              endCursor: {$set: comments.endCursor},
            },
          }
        });
        return updated;
      },
    });
  };

  render() {
    return <TabPane
      {...this.props}
      loadMore={this.loadMore}
    />;
  }
}

const LOAD_MORE_QUERY = gql`
  query TalkFeaturedComments_LoadMoreComments(
    $limit: Int = 5
    $cursor: Cursor
    $asset_id: ID
    $sort: SORT_ORDER
    $sortBy: SORT_COMMENTS_BY
    $excludeIgnored: Boolean
  ) {
    comments(
      query: {
        limit: $limit
        cursor: $cursor
        tags: ["FEATURED"]
        asset_id: $asset_id,
        sort: $sort
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

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    viewComment,
    addNotification,
  }, dispatch);

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
            sort: $sort
            sortBy: $sortBy
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
  }),
);

export default enhance(TabPaneContainer);
