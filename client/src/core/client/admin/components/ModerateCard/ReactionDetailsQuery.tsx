import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { QueryRenderer } from "coral-framework/lib/relay";
import { QueryError } from "coral-ui/components/v3";

import { ReactionDetailsQuery as QueryTypes } from "coral-admin/__generated__/ReactionDetailsQuery.graphql";

import ReactionDetailsContainer from "./ReactionDetailsContainer";

interface Props {
  commentID: string;
  onUsernameClick: (id?: string) => void;
}

const ReactionDetailsQuery: FunctionComponent<Props> = ({
  commentID,
  onUsernameClick,
}) => {
  return (
    <QueryRenderer<QueryTypes>
      query={graphql`
        query ReactionDetailsQuery($commentID: ID!) {
          comment(id: $commentID) {
            ...ReactionDetailsContainer_comment
          }
        }
      `}
      variables={{
        commentID,
      }}
      cacheConfig={{ force: true }}
      render={({ error, props }) => {
        if (error) {
          return <QueryError error={error} />;
        }

        if (!props) {
          return null;
        }

        if (props && props.comment) {
          return (
            <ReactionDetailsContainer
              comment={props.comment}
              onUsernameClick={onUsernameClick}
            />
          );
        }

        return null;
      }}
    />
  );
};

export default ReactionDetailsQuery;
