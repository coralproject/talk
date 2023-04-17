/* eslint-disable */
import { FunctionComponent } from "react";
import BanModal from "./BanModal";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { QueryRenderer, graphql } from "react-relay";

import { QueryTypes } from "coral-admin/__generated__/BanModalQuery"

export interface Props {
  user: BanModalContainer_user;
  viewer: BanModalContainer_viewer;
  settings: BanModalContainer_settings;
  onClose: () => void;
  onConfirm: () => void;
}

const BanModalContainer: FunctionComponent<Props> = ({
  viewer,
  user,
  settings,
  onClose,
  onConfirm
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
    />
  );
  return (
    <>
      <BanModal
        userID={user.id}
        username={user.username}
        open={true}
        onClose={onClose}
        onConfirm={onConfirm}
        viewer={viewer as unknown as UserStatusChangeContainer_viewer}
        emailDomainModeration={settings.emailDomainModeration}
        userBanStatus={user.status.ban}
        userEmail={user.email}
        userRole={user.role}
        isMultisite={settings.multisite}
      />
    </>
  );
}
