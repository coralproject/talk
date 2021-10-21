import React, { FunctionComponent, useCallback, useState } from "react";
import { graphql } from "react-relay";

import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import { GQLFEATURE_FLAG, GQLUSER_ROLE } from "coral-framework/schema";

import { UserStatusChangeContainer_settings } from "coral-admin/__generated__/UserStatusChangeContainer_settings.graphql";
import { UserStatusChangeContainer_user } from "coral-admin/__generated__/UserStatusChangeContainer_user.graphql";
import { UserStatusChangeContainer_viewer } from "coral-admin/__generated__/UserStatusChangeContainer_viewer.graphql";

import BanModal from "./BanModal";
import BanUserMutation from "./BanUserMutation";
import ModMessageModal from "./ModMessageModal";
import ModMessageUserMutation from "./ModMessageUserMutation";
import PremodModal from "./PremodModal";
import PremodUserMutation from "./PremodUserMutation";
import RemoveUserBanMutation from "./RemoveUserBanMutation";
import RemoveUserPremodMutation from "./RemoveUserPremodMutation";
import RemoveUserSuspensionMutation from "./RemoveUserSuspensionMutation";
import RemoveUserWarningMutation from "./RemoveUserWarningMutation";
import SuspendModal from "./SuspendModal";
import SuspendUserMutation from "./SuspendUserMutation";
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
  const banUser = useMutation(BanUserMutation);
  const suspendUser = useMutation(SuspendUserMutation);
  const removeUserBan = useMutation(RemoveUserBanMutation);
  const removeUserSuspension = useMutation(RemoveUserSuspensionMutation);
  const premodUser = useMutation(PremodUserMutation);
  const removeUserPremod = useMutation(RemoveUserPremodMutation);
  const warnUser = useMutation(WarnUserMutation);
  const modMessageUser = useMutation(ModMessageUserMutation);
  const removeUserWarning = useMutation(RemoveUserWarningMutation);
  const [showPremod, setShowPremod] = useState<boolean>(false);
  const [showBanned, setShowBanned] = useState<boolean>(false);
  const [showSuspend, setShowSuspend] = useState<boolean>(false);
  const [showWarn, setShowWarn] = useState<boolean>(false);
  const [showModMessage, setShowModMessage] = useState<boolean>(false);
  const [showSuspendSuccess, setShowSuspendSuccess] = useState<boolean>(false);
  const [showWarnSuccess, setShowWarnSuccess] = useState<boolean>(false);
  const [showModMessageSuccess, setShowModMessageSuccess] = useState<boolean>(
    false
  );

  const moderationScopesEnabled =
    settings.featureFlags.includes(GQLFEATURE_FLAG.SITE_MODERATOR) &&
    settings.multisite;

  const handleModMessage = useCallback(() => {
    setShowModMessage(true);
  }, [user, setShowModMessage]);
  const hideSendModMessage = useCallback(() => {
    setShowModMessage(false);
    setShowModMessageSuccess(false);
  }, [setShowWarn]);
  const handleSendModMessageConfirm = useCallback(
    (message: string) => {
      void modMessageUser({ userID: user.id, message });
      setShowModMessageSuccess(true);
    },
    [modMessageUser, user, setShowModMessageSuccess]
  );
  const handleWarn = useCallback(() => {
    if (user.status.warning.active) {
      return;
    }
    setShowWarn(true);
  }, [user, setShowWarn]);
  const handleRemoveWarning = useCallback(() => {
    if (!user.status.warning.active) {
      return;
    }
    void removeUserWarning({ userID: user.id });
  }, [user, removeUserWarning]);
  const hideWarn = useCallback(() => {
    setShowWarn(false);
    setShowWarnSuccess(false);
  }, [setShowWarn]);
  const handleWarnConfirm = useCallback(
    (message: string) => {
      void warnUser({ userID: user.id, message });
      setShowWarnSuccess(true);
    },
    [warnUser, user, setShowWarnSuccess]
  );
  const handleBan = useCallback(() => {
    if (user.status.ban.active) {
      return;
    }
    setShowBanned(true);
  }, [user, setShowBanned]);
  const handleRemoveBan = useCallback(() => {
    if (
      !user.status.ban.active &&
      (!user.status.ban.sites || user.status.ban.sites.length === 0)
    ) {
      return;
    }

    void removeUserBan({ userID: user.id });
  }, [user, removeUserBan]);
  const handleSuspend = useCallback(() => {
    if (user.status.suspension.active) {
      return;
    }
    setShowSuspend(true);
  }, [user, setShowSuspend]);
  const handleRemoveSuspension = useCallback(() => {
    if (!user.status.suspension.active) {
      return;
    }
    void removeUserSuspension({ userID: user.id });
  }, [user, removeUserSuspension]);

  const handlePremod = useCallback(() => {
    if (user.status.premod.active) {
      return;
    }
    setShowPremod(true);
  }, [user, setShowPremod]);

  const handlePremodConfirm = useCallback(() => {
    void premodUser({ userID: user.id });
    setShowPremod(false);
  }, [premodUser, user, setShowPremod]);

  const hidePremod = useCallback(() => {
    setShowPremod(false);
  }, [setShowPremod]);

  const handleRemovePremod = useCallback(() => {
    if (!user.status.premod.active) {
      return;
    }
    void removeUserPremod({ userID: user.id });
  }, [user, removeUserPremod]);

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
        userID: user.id,
        timeout,
        message,
      });
      setShowSuspendSuccess(true);
    },
    [user, suspendUser, setShowSuspendSuccess]
  );

  const handleBanConfirm = useCallback(
    (rejectExistingComments, message, siteIDs) => {
      void banUser({
        userID: user.id,
        message,
        rejectExistingComments,
        siteIDs,
      });
      setShowBanned(false);
    },
    [banUser, user.id]
  );

  if (user.role !== GQLUSER_ROLE.COMMENTER) {
    return (
      <UserStatusContainer
        user={user}
        moderationScopesEnabled={moderationScopesEnabled}
      />
    );
  }

  return (
    <>
      <UserStatusChange
        onBan={handleBan}
        onRemoveBan={!viewer.moderationScopes?.scoped && handleRemoveBan}
        onSuspend={handleSuspend}
        onRemoveSuspension={handleRemoveSuspension}
        onPremod={handlePremod}
        onRemovePremod={handleRemovePremod}
        banned={
          user.status.ban.active ||
          !!(
            user.status.ban &&
            user.status.ban.sites &&
            user.status.ban?.sites?.length !== 0
          )
        }
        suspended={user.status.suspension.active}
        premod={user.status.premod.active}
        warned={user.status.warning.active}
        onWarn={handleWarn}
        onRemoveWarning={handleRemoveWarning}
        onModMessage={handleModMessage}
        fullWidth={fullWidth}
        bordered={bordered}
        moderationScopesEnabled={moderationScopesEnabled}
      >
        <UserStatusContainer
          user={user}
          moderationScopesEnabled={moderationScopesEnabled}
        />
      </UserStatusChange>
      <SuspendModal
        username={user.username}
        open={showSuspend || showSuspendSuccess}
        success={showSuspendSuccess}
        onClose={handleSuspendModalClose}
        organizationName={settings.organization.name}
        onConfirm={handleSuspendConfirm}
      />
      <PremodModal
        username={user.username}
        open={showPremod}
        onClose={hidePremod}
        onConfirm={handlePremodConfirm}
      />
      <WarnModal
        username={user.username}
        organizationName={settings.organization.name}
        open={showWarn}
        onClose={hideWarn}
        onConfirm={handleWarnConfirm}
        success={showWarnSuccess}
      />
      <ModMessageModal
        username={user.username}
        open={showModMessage}
        onClose={hideSendModMessage}
        onConfirm={handleSendModMessageConfirm}
        success={showModMessageSuccess}
      />
      {
        <BanModal
          username={user.username}
          open={showBanned}
          onClose={handleBanModalClose}
          onConfirm={handleBanConfirm}
          moderationScopesEnabled={moderationScopesEnabled}
          viewerScopes={{
            role: viewer.role,
            sites: viewer.moderationScopes?.sites?.map((s) => s),
          }}
          userScopes={{
            role: user.role,
            sites: user.status.ban.sites?.map((s) => s),
          }}
        />
      }
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
  user: graphql`
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
  settings: graphql`
    fragment UserStatusChangeContainer_settings on Settings {
      organization {
        name
      }
      multisite
      featureFlags
    }
  `,
  viewer: graphql`
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
})(UserStatusChangeContainer);

export default enhanced;
