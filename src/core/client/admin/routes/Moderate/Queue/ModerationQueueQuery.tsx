import { Match } from "found";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { QueryRenderer } from "coral-framework/lib/relay";

import {
  ModerationQueueQuery as QueryTypes,
  ModerationQueueQueryResponse,
} from "coral-admin/__generated__/ModerationQueueQuery.graphql";

import ModerationQueue from "./ModerationQueue";

interface Props {
  settings: ModerationQueueQueryResponse;
  match: Match;
}

const ModerationQueueQuery: FunctionComponent<Props> = ({ match }) => {
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
        return (
          <ModerationQueue
            mode={props.settings.moderation}
            siteID={match.params.siteID}
            storyID={match.params.storyID}
          />
        );
      }}
    />
  );
};

export default ModerationQueueQuery;
