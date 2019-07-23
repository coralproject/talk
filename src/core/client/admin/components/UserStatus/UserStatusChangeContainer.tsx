import React, { FunctionComponent, useCallback, useState } from "react";

import { UserStatusChangeContainer_user as UserData } from "coral-admin/__generated__/UserStatusChangeContainer_user.graphql";
import {
  graphql,
  useMutation,
  withFragmentContainer,
} from "coral-framework/lib/relay";
import { GQLUSER_ROLE } from "coral-framework/schema";

import ButtonPadding from "../ButtonPadding";
import BanModal from "./BanModal";
import BanUserMutation from "./BanUserMutation";
import RemoveUserBanMutation from "./RemoveUserBanMutation";
import RemoveUserSuspensionMutation from "./RemoveUserSuspensionMutation";
import SuspendModal from "./SuspendModal";
import SuspendUserMutation from "./SuspendUserMutation";
import UserStatusChange from "./UserStatusChange";
import UserStatusContainer from "./UserStatusContainer";

interface Props {
  user: UserData;
  fullWidth?: boolean;
}

const UserStatusChangeContainer: FunctionComponent<Props> = ({
  user,
  fullWidth = false,
}) => {
  const banUser = useMutation(BanUserMutation);
  const suspendUser = useMutation(SuspendUserMutation);
  const removeUserBan = useMutation(RemoveUserBanMutation);
  const removeUserSuspension = useMutation(RemoveUserSuspensionMutation);
  const [showBanned, setShowBanned] = useState<boolean>(false);
  const [showSuspend, setShowSuspend] = useState<boolean>(false);
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

  if (user.role !== GQLUSER_ROLE.COMMENTER) {
    return (
      <ButtonPadding>
        <UserStatusContainer user={user} />
      </ButtonPadding>
    );
  }

  return (
    <>
      <UserStatusChange
        onBan={handleBan}
        onRemoveBan={handleRemoveBan}
        onSuspend={handleSuspend}
        onRemoveSuspension={handleRemoveSuspension}
        banned={user.status.ban.active}
        suspended={user.status.suspension.active}
        fullWidth={fullWidth}
      >
        <UserStatusContainer user={user} />
      </UserStatusChange>
      <SuspendModal
        username={user.username}
        open={showSuspend}
        onClose={() => setShowSuspend(false)}
        onConfirm={timeout => {
          suspendUser({ userID: user.id, timeout });
          setShowSuspend(false);
        }}
      />
      <BanModal
        username={user.username}
        open={showBanned}
        onClose={() => setShowBanned(false)}
        onConfirm={() => {
          banUser({ userID: user.id });
          setShowBanned(false);
        }}
      />
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
  user: graphql`
    fragment UserStatusChangeContainer_user on User {
      ...UserStatusContainer_user
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
      }
    }
  `,
})(UserStatusChangeContainer);

export default enhanced;
