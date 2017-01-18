import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {fetchSignIn} from 'coral-framework/actions/auth';
import RileysAwesomeCommentBox from 'coral-plugin-stream/RileysAwesomeCommentBox';
import CommentBody from 'coral-plugin-commentcontent/CommentContent';

const assetID = 'bc7b4cef-1e14-46e1-9db4-66465192f168';

// MyComponent is a "presentational" or apollo-unaware component,
// It could be a simple React class:
class Stream extends Component {

  constructor(props) {
    super(props);
  }

  logMeIn() {
    fetchSignIn({email: 'your@example.com', password: 'dfasidfaisdufoiausdfoiuaspdoifas'})(() => {});
  }

  render() {
    console.log(this.props);
    const {data} = this.props;
    return <div>
      <button onClick={this.logMeIn.bind(this)}>Login or whatever</button>
      {
        data.loading
        ? 'loading!'
        : <div>
            <RileysAwesomeCommentBox asset_id={data.asset.id} />
            <p>Asset ID: {data.asset.id}</p>
            {
              data.asset.comments.map(comment => {
                return <div key={comment.id}>
                  <CommentBody
                    body={comment.body}/>
                    {
                      comment.replies.map(reply => {
                        return <div key={reply.id}>
                          <CommentBody
                            body={reply.body}/>
                        </div>;
                      })
                    }
                </div>;
              })
            }
        </div>
      }
    </div>;
  }
}

// Initialize GraphQL queries or mutations with the `gql` tag
const StreamQuery = gql`fragment commentView on Comment {
  id
  body
  user {
    name: displayName
  }
  actions {
    type: action_type
    count
    current: current_user {
      id
      created_at
    }
  }
}

query AssetQuery($asset_id: ID!) {
  asset(id: $asset_id) {
    id
    title
    url
    comments {
      ...commentView
      replies {
        ...commentView
      }
    }
  }
}`;

// We then can use `graphql` to pass the query results returned by MyQuery
// to MyComponent as a prop (and update them as the results change)
const StreamWithData = graphql(
  StreamQuery, {
    options: {
      variables: {
        asset_id: assetID
      }
    }
  }
)(Stream);

export default StreamWithData;
