import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

export class RileysAwesomeCommentBox extends Component {

  postComment() {
    console.log(this.props);
    console.log('postComment', this.props.asset_id);
    this.props.mutate({
      variables: {
        asset_id: this.props.asset_id,
        body: this.textarea.value,
        parent_id: null
      }
    }).then(({data}) => {
      console.log('it workt');
      console.log(data);
    });
  }

  render() {
    return <div>
      <textarea ref={textarea => this.textarea = textarea}></textarea>
      <button onClick={this.postComment.bind(this)}>POST</button>
    </div>;
  }
}

const postComment = gql`
  fragment commentView on Comment {
    id
    body
    user {
      name: username
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

  mutation CreateComment ($asset_id: ID!, $parent_id: ID, $body: String!) {
    createComment(asset_id:$asset_id, parent_id:$parent_id, body:$body) {
        ...commentView
      }
    }
`;

const RileysAwesomeCommentBoxWithData = graphql(
  postComment
)(RileysAwesomeCommentBox);

export default RileysAwesomeCommentBoxWithData;
