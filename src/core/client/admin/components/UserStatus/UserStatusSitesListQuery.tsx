import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { QueryRenderData, QueryRenderer } from "coral-framework/lib/relay";

import { UserStatusSitesListQuery as QueryTypes } from "coral-admin/__generated__/UserStatusSitesListQuery.graphql";

import UserStatusSitesListContainer, {
  Scopes,
} from "./UserStatusSitesListContainer";

interface Props {
  viewerScopes: Scopes;
  userScopes: Scopes;
}

const UserStatusSitesListQuery: FunctionComponent<Props> = ({
  viewerScopes,
  userScopes,
}) => {
  return (
    <>
      <QueryRenderer<QueryTypes>
        query={graphql`
          query UserStatusSitesListQuery {
            ...UserStatusSitesListContainer_query
          }
        `}
        variables={{}}
        render={({ error, props }: QueryRenderData<QueryTypes>) => {
          if (error) {
            return <div>{error.message}</div>;
          }

          if (!props) {
            return null;
          }

          if (props) {
            return (
              <UserStatusSitesListContainer
                query={props}
                viewerScopes={viewerScopes}
                userScopes={userScopes}
              />
            );
          }

          return null;
        }}
      />
    </>
  );
};

export default UserStatusSitesListQuery;
