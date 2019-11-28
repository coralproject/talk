import React, { FunctionComponent, useCallback, useState } from "react";

import {
  graphql,
  useMutation,
  withFragmentContainer,
} from "coral-framework/lib/relay";
import { GQLUSER_ROLE } from "coral-framework/schema";

import { UserStatusChangeContainer_organization as OrgData } from "coral-admin/__generated__/UserStatusChangeContainer_organization.graphql";
import { UserStatusChangeContainer_user as UserData } from "coral-admin/__generated__/UserStatusChangeContainer_user.graphql";

import BanModal from "./BanModal";
import BanUserMutation from "./BanUserMutation";
import PremodModal from "./PremodModal";
import PremodUserMutation from "./PremodUserMutation";
import RemoveUserBanMutation from "./RemoveUserBanMutation";
import RemoveUserPremodMudtaion from "./RemoveUserPremodMutation";
import RemoveUserSuspensionMutation from "./RemoveUserSuspensionMutation";
import SuspendModal from "./SuspendModal";
import SuspendUserMutation from "./SuspendUserMutation";
import UserStatusChange from "./UserStatusChange";
import UserStatusContainer from "./UserStatusContainer";

interface Props {
  user: UserData;
  organization: OrgData;
  fullWidth?: boolean;
  bordered?: boolean;
}

const UserStatusChangeContainer: FunctionComponent<Props> = props => {
  const { user, fullWidth, bordered, organization } = props;
  const banUser = useMutation(BanUserMutation);
  const suspendUser = useMutation(SuspendUserMutation);
  const removeUserBan = useMutation(RemoveUserBanMutation);
  const removeUserSuspension = useMutation(RemoveUserSuspensionMutation);
  const premodUser = useMutation(PremodUserMutation);
  const removeUserPremod = useMutation(RemoveUserPremodMudtaion);
  const [showPremod, setShowPremod] = useState<boolean>(false);
  const [showBanned, setShowBanned] = useState<boolean>(false);
  const [showSuspend, setShowSuspend] = useState<boolean>(false);
  const [showSuspendSuccess, setShowSuspendSuccess] = useState<boolean>(false);
  const handleBan = useCallback(() => {
    if (user.status.ban.active) {
      return;
    }
    setShowBanned(true);
  }, [user, setShowBanned]);
  const handleRemoveBan = useCallback(() => {
    if (!user.status.ban.active) {
      return;
    }
    removeUserBan({ userID: user.id });
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
    removeUserSuspension({ userID: user.id });
  }, [user, removeUserSuspension]);

  const handlePremod = useCallback(() => {
    if (user.status.premod.active) {
      return;
    }
    setShowPremod(true);
  }, [user, setShowPremod]);

  const handlePremodConfirm = useCallback(() => {
    premodUser({ userID: user.id });
    setShowPremod(false);
  }, [premodUser, user, setShowPremod]);

  const hidePremod = useCallback(() => {
    setShowPremod(false);
  }, [setShowPremod]);

  const handleRemovePremod = useCallback(() => {
    if (!user.status.premod.active) {
      return;
    }
    removeUserPremod({ userID: user.id });
  }, [user, premodUser]);

  const handleSuspendModalClose = useCallback(() => {
    setShowSuspend(false);
    setShowSuspendSuccess(false);
  }, [setShowBanned, setShowSuspendSuccess]);

  const handleBanModalClose = useCallback(() => {
    setShowBanned(false);
  }, [setShowBanned]);

  const handleSuspendConfirm = useCallback(
    (timeout, message) => {
      suspendUser({
        userID: user.id,
        timeout,
        message,
      });
      setShowSuspendSuccess(true);
    },
    [user, suspendUser, setShowSuspendSuccess]
  );

  const handleBanConfirm = useCallback(
    message => {
      banUser({ userID: user.id, message });
      setShowBanned(false);
    },
    [user, setShowBanned]
  );

  if (user.role !== GQLUSER_ROLE.COMMENTER) {
    return <UserStatusContainer user={user} />;
  }

  return (
    <>
      <UserStatusChange
        onBan={handleBan}
        onRemoveBan={handleRemoveBan}
        onSuspend={handleSuspend}
        onRemoveSuspension={handleRemoveSuspension}
        onPremod={handlePremod}
        onRemovePremod={handleRemovePremod}
        banned={user.status.ban.active}
        suspended={user.status.suspension.active}
        premod={user.status.premod.active}
        fullWidth={fullWidth}
        bordered={bordered}
      >
        <UserStatusContainer user={user} />
      </UserStatusChange>
      <SuspendModal
        username={user.username}
        open={showSuspend || showSuspendSuccess}
        success={showSuspendSuccess}
        onClose={handleSuspendModalClose}
        organizationName={organization.name}
        onConfirm={handleSuspendConfirm}
      />
      <PremodModal
        username={user.username}
        open={showPremod}
        onClose={hidePremod}
        onConfirm={handlePremodConfirm}
      />
      <BanModal
        username={user.username}
        open={showBanned}
        onClose={handleBanModalClose}
        onConfirm={handleBanConfirm}
      />
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
        }
        suspension {
          active
        }
        premod {
          active
        }
      }
      ...UserStatusContainer_user
    }
  `,
  organization: graphql`
    fragment UserStatusChangeContainer_organization on Organization {
      name
    }
  `,
})(UserStatusChangeContainer);

export default enhanced;
