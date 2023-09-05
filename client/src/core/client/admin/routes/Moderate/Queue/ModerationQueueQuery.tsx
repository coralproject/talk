import { Match } from "found";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { parseModerationOptions } from "coral-framework/helpers";
import { QueryRenderer } from "coral-framework/lib/relay";
import { QueryError } from "coral-ui/components/v3";

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
      render={({ props, error }) => {
        if (error) {
          return <QueryError error={error} />;
        }

        if (!props) {
          return null;
        }
        return (
          <ModerationQueue
            mode={props.settings.moderation}
            pathOptions={parseModerationOptions(match)}
          />
        );
      }}
    />
  );
};

export default ModerationQueueQuery;
