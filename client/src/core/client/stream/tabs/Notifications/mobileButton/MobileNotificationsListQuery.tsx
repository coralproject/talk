import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { QueryRenderer } from "coral-framework/lib/relay";
import { Spinner } from "coral-ui/components/v2";
import { QueryError } from "coral-ui/components/v3";

import { MobileNotificationsListQuery as QueryTypes } from "coral-stream/__generated__/MobileNotificationsListQuery.graphql";
import MobileNotificationsPaginator from "./MobileNotificationsPaginator";

interface Props {
  viewerID: string;
}

const MobileNotificationsListQuery: FunctionComponent<Props> = ({
  viewerID,
}) => {
  return (
    <QueryRenderer<QueryTypes>
      query={graphql`
        query MobileNotificationsListQuery($viewerID: ID!) {
          ...MobileNotificationsPaginator_query @arguments(viewerID: $viewerID)
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
          <MobileNotificationsPaginator query={props} viewerID={viewerID} />
        );
      }}
    />
  );
};

export default MobileNotificationsListQuery;
