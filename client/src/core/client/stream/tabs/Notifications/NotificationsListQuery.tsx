import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { QueryRenderer } from "coral-framework/lib/relay";
import { Spinner } from "coral-ui/components/v2";
import { QueryError } from "coral-ui/components/v3";

import { NotificationsListQuery as QueryTypes } from "coral-stream/__generated__/NotificationsListQuery.graphql";
import NotificationsPaginator from "./NotificationsPaginator";

interface Props {
  viewerID: string;
}

const NotificationsListQuery: FunctionComponent<Props> = ({ viewerID }) => {
  return (
    <QueryRenderer<QueryTypes>
      query={graphql`
        query NotificationsListQuery($viewerID: ID!) {
          ...NotificationsPaginator_query @arguments(viewerID: $viewerID)
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

        return <NotificationsPaginator query={props} viewerID={viewerID} />;
      }}
    />
  );
};

export default NotificationsListQuery;
