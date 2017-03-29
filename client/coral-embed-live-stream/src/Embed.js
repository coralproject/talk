import React from 'react';

import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

import PubDate from 'coral-plugin-pubdate/PubDate';

class Embed extends React.Component {

  static propTypes = {
    assetID: React.PropTypes.string.isRequired,
    subscribeToNewComments: React.PropTypes.func.isRequired,
    data: React.PropTypes.shape({
      loading: React.PropTypes.bool.isRequired,
      asset: React.PropTypes.object,
    }).isRequired
  }

  componentWillMount() {
    const {assetID} = this.props;
    this.props.subscribeToNewComments({assetID});
  }

  render() {
    const {asset, loading} = this.props.data;
    return (
      <div>
        <h1>Wyatt's Awesome Live Stream</h1>
        <div>
          {!loading && asset && asset.comments && asset.comments.map((comment) => (
            <div key={comment.id} style={{position: 'relative'}}>
              <span>
                <b>{comment.user.username}</b> - {comment.body}
              </span>
              <span
                style={{float: 'right'}}
              >
                <PubDate created_at={comment.created_at} />
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

const COMMENT_QUERY = gql`
  query Comment($assetID: ID!) {
    asset(id: $assetID) {
      comments(limit: 50) {
        id
        body
        user {
          username
        }
        created_at
      }
    }
  }
`;

const COMMENTS_SUBSCRIPTION = gql`
  subscription onCommentAdded($assetID: ID!){
    commentAdded(asset_id: $assetID) {
      id
      body
      user {
        username
      }
      created_at
    }
  }
`;

const withData = graphql(COMMENT_QUERY, {
  options: ({assetID}) => ({
    variables: {
      assetID
    },
  }),
  props: (props) => ({
    ...props,
    subscribeToNewComments: ({assetID}) => {
      return props.data.subscribeToMore({
        document: COMMENTS_SUBSCRIPTION,
        variables: {assetID},
        updateQuery: (before, {subscriptionData}) => {
          if (!subscriptionData.data) {
            return before;
          }

          const newComment = subscriptionData.data.commentAdded;

          if (!newComment) {
            console.warn('last comment was null :/');
            return before;
          }

          let after = {
            ...before,
            asset: {
              ...before.asset,
              comments: [newComment, ...before.asset.comments]
            }
          };

          return after;
        }
      });
    }
  })
});

export default withData(Embed);
