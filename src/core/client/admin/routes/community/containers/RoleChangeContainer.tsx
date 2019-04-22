import React, { StatelessComponent, useCallback } from "react";

import { UpdateUserRoleMutation } from "talk-admin/mutations";
import { useMutation } from "talk-framework/lib/relay";
import { GQLUSER_ROLE_RL } from "talk-framework/schema";

import RoleChange from "../components/RoleChange";

interface Props {
  userID: string;
  role: GQLUSER_ROLE_RL;
}

const RoleChangeContainer: StatelessComponent<Props> = props => {
  const updateUserRole = useMutation(UpdateUserRoleMutation);
  const handleOnChangeRole = useCallback(
    (role: GQLUSER_ROLE_RL) => {
      if (role === props.role) {
        return;
      }
      updateUserRole({ userID: props.userID, role });
    },
    [props.userID, props.role, updateUserRole]
  );
  return <RoleChange onChangeRole={handleOnChangeRole} role={props.role} />;
};

export default RoleChangeContainer;
