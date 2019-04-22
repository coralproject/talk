import React, { StatelessComponent, useCallback, useState } from "react";

import { UserStatusChangeContainer_user as UserData } from "talk-admin/__generated__/UserStatusChangeContainer_user.graphql";
import { BanUserMutation, RemoveUserBanMutation } from "talk-admin/mutations";
import {
  graphql,
  useMutation,
  withFragmentContainer,
} from "talk-framework/lib/relay";
import { GQLUSER_ROLE } from "talk-framework/schema";

import BanModal from "../components/BanModal";
import ButtonPadding from "../components/ButtonPadding";
import UserStatusChange from "../components/UserStatusChange";
import UserStatusContainer from "./UserStatusContainer";

interface Props {
  user: UserData;
}

const UserStatusChangeContainer: StatelessComponent<Props> = props => {
  const banUser = useMutation(BanUserMutation);
  const removeUserBan = useMutation(RemoveUserBanMutation);
  const [showBanned, setShowBanned] = useState<boolean>(false);
  const handleBan = useCallback(
    () => {
      if (props.user.status.ban.active) {
        return;
      }
      setShowBanned(true);
    },
    [props.user, setShowBanned]
  );
  const handleRemoveBan = useCallback(
    () => {
      if (!props.user.status.ban.active) {
        return;
      }
      removeUserBan({ userID: props.user.id });
    },
    [props.user, removeUserBan]
  );
  const handleSuspend = useCallback(
    () => {
      if (props.user.status.suspension.active) {
        return;
      }
      // TODO: (cvle)
    },
    [props.user]
  );
  const handleRemoveSuspension = useCallback(
    () => {
      if (!props.user.status.suspension.active) {
        return;
      }
      // TODO: (cvle)
    },
    [props.user]
  );

  if (props.user.role !== GQLUSER_ROLE.COMMENTER) {
    return (
      <ButtonPadding>
        <UserStatusContainer user={props.user} />
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
        banned={props.user.status.ban.active}
        suspended={props.user.status.suspension.active}
      >
        <UserStatusContainer user={props.user} />
      </UserStatusChange>
      <BanModal
        username={props.user.username}
        open={showBanned}
        onClose={() => setShowBanned(false)}
        onConfirm={() => {
          banUser({ userID: props.user.id });
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
