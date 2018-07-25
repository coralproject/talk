import * as React from "react";
import { StatelessComponent } from "react";
import { ReadyState } from "react-relay";

import { graphql, QueryRenderer } from "talk-framework/lib/relay";

import {
  PermalinkViewQueryResponse,
  PermalinkViewQueryVariables,
} from "talk-stream/__generated__/PermalinkViewQuery.graphql";
import { PermalinkViewContainer } from "talk-stream/containers/PermalinkViewContainer";

export interface CommentData {
  id: string;
  author: {
    username: string;
  } | null;
  body: string | null;
  createdAt: string;
}

export const render = ({
  error,
  props,
}: ReadyState<{
  comment: CommentData;
}>) => {
  if (error) {
    return <div>{error.message}</div>;
  }
  if (props) {
    return <PermalinkViewContainer data={props} />;
  }
  return <div>Loading</div>;
};

interface InnerProps {
  commentID: string;
}

const PermalinkViewQuery: StatelessComponent<InnerProps> = props => {
  return (
    <QueryRenderer<PermalinkViewQueryVariables, PermalinkViewQueryResponse>
      query={graphql`
        query PermalinkViewQuery($commentID: ID!) {
          ...PermalinkViewContainer @arguments(commentID: $commentID)
        }
      `}
      variables={{
        commentID: props.commentID,
      }}
      render={render}
    />
  );
};

export default PermalinkViewQuery;
