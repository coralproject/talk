import React, { FunctionComponent, useCallback, useState } from "react";
import { graphql, useFragment } from "react-relay";

import { useMutation } from "coral-framework/lib/relay";
import { GQLUSER_ROLE } from "coral-framework/schema";

import { UserStatusChangeContainer_settings$key as UserStatusChangeContainer_settings } from "coral-admin/__generated__/UserStatusChangeContainer_settings.graphql";
import { UserStatusChangeContainer_user$key as UserStatusChangeContainer_user } from "coral-admin/__generated__/UserStatusChangeContainer_user.graphql";
import { UserStatusChangeContainer_viewer$key as UserStatusChangeContainer_viewer } from "coral-admin/__generated__/UserStatusChangeContainer_viewer.graphql";

import BanModal, { UpdateType } from "./BanModal";
import BanUserMutation from "./BanUserMutation";
import ModMessageModal from "./ModMessageModal";
import PremodModal from "./PremodModal";
import PremodUserMutation from "./PremodUserMutation";
import RemoveUserBanMutation from "./RemoveUserBanMutation";
import RemoveUserPremodMutation from "./RemoveUserPremodMutation";
import RemoveUserSuspensionMutation from "./RemoveUserSuspensionMutation";
import RemoveUserWarningMutation from "./RemoveUserWarningMutation";
import SendModMessageMutation from "./SendModMessageMutation";
import SuspendModal from "./SuspendModal";
import SuspendUserMutation from "./SuspendUserMutation";
import UpdateUserBanMutation from "./UpdateUserBanMutation";
import UserStatusChange from "./UserStatusChange";
import UserStatusContainer from "./UserStatusContainer";
import WarnModal from "./WarnModal";
import WarnUserMutation from "./WarnUserMutation";

interface Props {
  settings: UserStatusChangeContainer_settings;
  user: UserStatusChangeContainer_user;
  viewer: UserStatusChangeContainer_viewer;
  fullWidth?: boolean;
  bordered?: boolean;
}

const UserStatusChangeContainer: FunctionComponent<Props> = ({
  user,
  settings,
  fullWidth,
  bordered,
  viewer,
}) => {
  const userData = useFragment(
    graphql`
      fragment UserStatusChangeContainer_user on User {
        id
        role
        username
        status {
          ban {
            active
            sites {
              id
              name
            }
          }
          suspension {
            active
          }
          premod {
            active
          }
          warning {
            active
          }
        }
        ...UserStatusContainer_user
      }
    `,
    user
  );
  const settingsData = useFragment(
    graphql`
      fragment UserStatusChangeContainer_settings on Settings {
        organization {
          name
        }
        multisite
      }
    `,
    settings
  );
  const viewerData = useFragment(
    graphql`
      fragment UserStatusChangeContainer_viewer on User {
        role
        moderationScopes {
          scoped
          sites {
            id
            name
          }
        }
      }
    `,
    viewer
  );

  const banUser = useMutation(BanUserMutation);
  const updateUserBan = useMutation(UpdateUserBanMutation);
  const unbanUser = useMutation(RemoveUserBanMutation);
  const suspendUser = useMutation(SuspendUserMutation);
  const removeUserSuspension = useMutation(RemoveUserSuspensionMutation);
  const premodUser = useMutation(PremodUserMutation);
  const removeUserPremod = useMutation(RemoveUserPremodMutation);
  const warnUser = useMutation(WarnUserMutation);
  const sendModMessage = useMutation(SendModMessageMutation);
  const removeUserWarning = useMutation(RemoveUserWarningMutation);
  const [showPremod, setShowPremod] = useState<boolean>(false);
  const [showBanned, setShowBanned] = useState<boolean>(false);
  const [showSuspend, setShowSuspend] = useState<boolean>(false);
  const [showWarn, setShowWarn] = useState<boolean>(false);
  const [showModMessage, setShowModMessage] = useState<boolean>(false);
  const [showSuspendSuccess, setShowSuspendSuccess] = useState<boolean>(false);
  const [showWarnSuccess, setShowWarnSuccess] = useState<boolean>(false);
  const [showSendModMessageSuccess, setShowSendModMessageSuccess] = useState<
    boolean
  >(false);

  const moderationScopesEnabled = settingsData.multisite;
  const viewerIsScoped = !!viewerData.moderationScopes?.sites?.length;

  const handleModMessage = useCallback(() => {
    setShowModMessage(true);
  }, [userData, setShowModMessage]);
  const hideSendModMessage = useCallback(() => {
    setShowModMessage(false);
    setShowSendModMessageSuccess(false);
  }, [setShowWarn]);
  const handleSendModMessageConfirm = useCallback(
    (message: string) => {
      void sendModMessage({ userID: userData.id, message });
      setShowSendModMessageSuccess(true);
    },
    [sendModMessage, userData, setShowSendModMessageSuccess]
  );
  const handleWarn = useCallback(() => {
    if (userData.status.warning.active) {
      return;
    }
    setShowWarn(true);
  }, [userData, setShowWarn]);
  const handleRemoveWarning = useCallback(() => {
    if (!userData.status.warning.active) {
      return;
    }
    void removeUserWarning({ userID: userData.id });
  }, [userData, removeUserWarning]);
  const hideWarn = useCallback(() => {
    setShowWarn(false);
    setShowWarnSuccess(false);
  }, [setShowWarn]);
  const handleWarnConfirm = useCallback(
    (message: string) => {
      void warnUser({ userID: userData.id, message });
      setShowWarnSuccess(true);
    },
    [warnUser, userData, setShowWarnSuccess]
  );

  const handleManageBan = useCallback(() => {
    setShowBanned(true);
  }, [setShowBanned]);

  const handleSuspend = useCallback(() => {
    if (userData.status.suspension.active) {
      return;
    }
    setShowSuspend(true);
  }, [userData, setShowSuspend]);
  const handleRemoveSuspension = useCallback(() => {
    if (!userData.status.suspension.active) {
      return;
    }
    void removeUserSuspension({ userID: userData.id });
  }, [userData, removeUserSuspension]);

  const handlePremod = useCallback(() => {
    if (userData.status.premod.active) {
      return;
    }
    setShowPremod(true);
  }, [userData, setShowPremod]);

  const handlePremodConfirm = useCallback(() => {
    void premodUser({ userID: userData.id });
    setShowPremod(false);
  }, [premodUser, userData, setShowPremod]);

  const hidePremod = useCallback(() => {
    setShowPremod(false);
  }, [setShowPremod]);

  const handleRemovePremod = useCallback(() => {
    if (!userData.status.premod.active) {
      return;
    }
    void removeUserPremod({ userID: userData.id });
  }, [userData, removeUserPremod]);

  const handleSuspendModalClose = useCallback(() => {
    setShowSuspend(false);
    setShowSuspendSuccess(false);
  }, [setShowSuspendSuccess]);

  const handleBanModalClose = useCallback(() => {
    setShowBanned(false);
  }, [setShowBanned]);

  const handleSuspendConfirm = useCallback(
    (timeout, message) => {
      void suspendUser({
        userID: userData.id,
        timeout,
        message,
      });
      setShowSuspendSuccess(true);
    },
    [userData, suspendUser, setShowSuspendSuccess]
  );

  const handleUpdateBan = useCallback(
    (updateType, rejectExistingComments, banSiteIDs, unbanSiteIDs, message) => {
      switch (updateType) {
        case UpdateType.ALL_SITES:
          void banUser({
            userID: userData.id,
            message,
            rejectExistingComments,
            siteIDs: viewerIsScoped
              ? viewerData?.moderationScopes?.sites?.map((s) => s.id)
              : [],
          });
          break;
        case UpdateType.SPECIFIC_SITES:
          void updateUserBan({
            userID: userData.id,
            message,
            rejectExistingComments,
            banSiteIDs,
            unbanSiteIDs,
          });
          break;
        case UpdateType.NO_SITES:
          void unbanUser({
            userID: userData.id,
          });
      }
      setShowBanned(false);
    },
    [
      banUser,
      userData.id,
      viewerIsScoped,
      viewerData?.moderationScopes?.sites,
      updateUserBan,
      unbanUser,
    ]
  );

  if (userData.role !== GQLUSER_ROLE.COMMENTER) {
    return (
      <UserStatusContainer
        user={userData}
        moderationScopesEnabled={moderationScopesEnabled}
      />
    );
  }

  return (
    <>
      <UserStatusChange
        onManageBan={handleManageBan}
        onSuspend={handleSuspend}
        onRemoveSuspension={handleRemoveSuspension}
        onPremod={handlePremod}
        onRemovePremod={handleRemovePremod}
        viewerIsScoped={viewerIsScoped}
        banned={userData.status.ban.active}
        suspended={userData.status.suspension.active}
        premod={userData.status.premod.active}
        warned={userData.status.warning.active}
        onWarn={handleWarn}
        onRemoveWarning={handleRemoveWarning}
        onModMessage={handleModMessage}
        fullWidth={fullWidth}
        bordered={bordered}
        moderationScopesEnabled={moderationScopesEnabled}
      >
        <UserStatusContainer
          user={userData}
          moderationScopesEnabled={moderationScopesEnabled}
        />
      </UserStatusChange>
      <SuspendModal
        username={userData.username}
        open={showSuspend || showSuspendSuccess}
        success={showSuspendSuccess}
        onClose={handleSuspendModalClose}
        organizationName={settingsData.organization.name}
        onConfirm={handleSuspendConfirm}
      />
      <PremodModal
        username={userData.username}
        open={showPremod}
        onClose={hidePremod}
        onConfirm={handlePremodConfirm}
      />
      <WarnModal
        username={userData.username}
        organizationName={settingsData.organization.name}
        open={showWarn}
        onClose={hideWarn}
        onConfirm={handleWarnConfirm}
        success={showWarnSuccess}
      />
      <ModMessageModal
        username={userData.username}
        open={showModMessage}
        onClose={hideSendModMessage}
        onConfirm={handleSendModMessageConfirm}
        success={showSendModMessageSuccess}
      />
      {showBanned && (
        <BanModal
          username={userData.username}
          open
          onClose={handleBanModalClose}
          onConfirm={handleUpdateBan}
          moderationScopesEnabled={moderationScopesEnabled}
          viewerScopes={{
            role: viewerData.role,
            sites: viewerData.moderationScopes?.sites?.map((s) => s),
          }}
          userBanStatus={userData.status.ban}
        />
      )}
    </>
  );
};

export default UserStatusChangeContainer;
