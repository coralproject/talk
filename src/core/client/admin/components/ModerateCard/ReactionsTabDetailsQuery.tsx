import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { QueryRenderer } from "coral-framework/lib/relay";
import { QueryError } from "coral-ui/components/v3";

import { ReactionsTabDetailsQuery as QueryTypes } from "coral-admin/__generated__/ReactionsTabDetailsQuery.graphql";

import ReactionsTabDetailsContainer from "./ReactionsTabDetailsContainer";

interface Props {
  commentID: string;
  onUsernameClick: (id?: string) => void;
}

const ReactionsTabDetailsQuery: FunctionComponent<Props> = ({
  commentID,
  onUsernameClick,
}) => {
  return (
    <QueryRenderer<QueryTypes>
      query={graphql`
        query ReactionsTabDetailsQuery($commentID: ID!) {
          comment(id: $commentID) {
            ...ReactionsTabDetailsContainer_comment
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
            <ReactionsTabDetailsContainer
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

export default ReactionsTabDetailsQuery;
