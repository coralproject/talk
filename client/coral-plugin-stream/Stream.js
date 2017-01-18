import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

const assetID = 'c82f9fbb-5cf6-4eeb-bde5-25bae78227d2';

// MyComponent is a "presentational" or apollo-unaware component,
// It could be a simple React class:
class Stream extends Component {

  constructor(props) {
    super(props);
  }

  componentWillUpdate() {
    console.log(this.props);
  }

  render() {
    return <div>...</div>;
  }
}

// Initialize GraphQL queries or mutations with the `gql` tag
const StreamQuery = gql`fragment commentView on Comment {
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
const StreamWithData = graphql(StreamQuery, {options: {variables: {asset_id: assetID}}})(Stream);

export default StreamWithData;
