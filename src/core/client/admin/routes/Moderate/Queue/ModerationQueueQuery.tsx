import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { QueryRenderer } from "coral-framework/lib/relay";
import ModerationQueue from "./ModerationQueue";

import {
  ModerationQueueQuery as QueryTypes,
  ModerationQueueQueryResponse,
} from "coral-admin/__generated__/ModerationQueueQuery.graphql";

interface Props {
  settings: ModerationQueueQueryResponse;
}

const ModerationQueueQuery: FunctionComponent<Props> = () => {
  return (
    <QueryRenderer<QueryTypes>
      query={graphql`
        query ModerationQueueQuery {
          settings {
            moderation
          }
        }
      `}
      variables={{}}
      fetchPolicy="store-and-network"
      render={({ props }) => {
        if (!props) {
          return null;
        }
        return <ModerationQueue mode={props.settings.moderation} />;
      }}
    />
  );
};

export default ModerationQueueQuery;
