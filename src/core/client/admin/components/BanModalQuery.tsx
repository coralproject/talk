import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";
import BanModal from "./BanModal";

import { BanModalQuery as QueryTypes } from "coral-admin/__generated__/BanModalQuery.graphql";
import { UserStatusChangeContainer_viewer } from "coral-admin/__generated__/UserStatusChangeContainer_viewer.graphql";
import { QueryRenderer } from "coral-framework/lib/relay";
import { QueryError } from "coral-ui/components/v3";

export interface Props {
  userID: string;
  onClose: () => void;
  onConfirm: () => void;
}

const BanModalQuery: FunctionComponent<Props> = ({
  userID,
  onClose,
  onConfirm,
}) => {
  return (
    <QueryRenderer<QueryTypes>
      query={graphql`
        query BanModalQuery($userID: ID!) {
          user(id: $userID) {
            id
            username
            email
            role
            status {
              ban {
                active
                sites {
                  id
                  name
                }
              }
            }
          }
          settings {
            multisite
            emailDomainModeration {
              domain
              newUserModeration
            }
          }
          viewer {
            id
            role
            moderationScopes {
              scoped
              sites {
                id
                name
              }
              siteIDs
            }
          }
        }
      `}
      variables={{
        userID,
      }}
      render={({ error, props }) => {
        if (error) {
          return <QueryError error={error} />;
        }
        if (!props || !props.settings || !props.user || !props.viewer) {
          return null;
        }
        return (
          <>
            <BanModal
              userID={props.user.id}
              username={props.user.username}
              open={true}
              onClose={onClose}
              onConfirm={onConfirm}
              viewer={
                props.viewer as unknown as UserStatusChangeContainer_viewer
              }
              emailDomainModeration={props.settings.emailDomainModeration}
              userBanStatus={props.user.status.ban}
              userEmail={props.user.email}
              userRole={props.user.role}
              isMultisite={props.settings.multisite}
            />
          </>
        );
      }}
    />
  );
};

export default BanModalQuery;
