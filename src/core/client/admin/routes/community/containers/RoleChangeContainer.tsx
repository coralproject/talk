import React, { FunctionComponent, useCallback } from "react";

import { UpdateUserRoleMutation } from "coral-admin/mutations";
import { useMutation } from "coral-framework/lib/relay";
import { GQLUSER_ROLE_RL } from "coral-framework/schema";

import RoleChange from "../components/RoleChange";

interface Props {
  userID: string;
  role: GQLUSER_ROLE_RL;
}

const RoleChangeContainer: FunctionComponent<Props> = props => {
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
