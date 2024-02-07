import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { QueryRenderer } from "coral-framework/lib/relay";
import { Spinner } from "coral-ui/components/v2";
import { QueryError } from "coral-ui/components/v3";

import { FloatingNotificationsListQuery as QueryTypes } from "coral-stream/__generated__/FloatingNotificationsListQuery.graphql";
import FloatingNotificationsPaginator from "./FloatingNotificationsPaginator";

interface Props {
  viewerID: string;
}

const FloatingNotificationsListQuery: FunctionComponent<Props> = ({
  viewerID,
}) => {
  return (
    <QueryRenderer<QueryTypes>
      query={graphql`
        query FloatingNotificationsListQuery($viewerID: ID!) {
          ...FloatingNotificationsPaginator_query
            @arguments(viewerID: $viewerID)
        }
      `}
      variables={{
        viewerID,
      }}
      render={({ error, props }) => {
        if (error) {
          return <QueryError error={error} />;
        }

        if (!props) {
          return <Spinner />;
        }

        return (
          <FloatingNotificationsPaginator query={props} viewerID={viewerID} />
        );
      }}
    />
  );
};

export default FloatingNotificationsListQuery;
