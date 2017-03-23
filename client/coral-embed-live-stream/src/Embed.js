import React from 'react';

import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

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
    console.log(this.props);
    const {asset, loading} = this.props.data;
    return (
      <div>
        <h1>Live Stream</h1>
        <ul>
          {!loading && asset && asset.comments && asset.comments.map((comment) => (
            <li key={comment.id}>
              <span>{comment.id} {comment.body}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

const COMMENT_QUERY = gql`
  query Comment($assetID: ID!) {
    asset(id: $assetID) {
      comments {
        id
        body
        user {
          username
        }
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

          console.log('updateQuery', before, after);

          return after;
        }
      });
    }
  })
});

export default withData(Embed);
