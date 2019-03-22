import React, { StatelessComponent, useCallback } from "react";

import {
  UpdateUserRoleMutation,
  withUpdateUserRoleMutation,
} from "talk-admin/mutations/UpdateUserRoleMutation";
import { GQLUSER_ROLE_RL } from "talk-framework/schema";

import RoleChange from "../components/RoleChange";

interface Props {
  userID: string;
  role: GQLUSER_ROLE_RL;
  updateUserRole: UpdateUserRoleMutation;
}

const RoleChangeContainer: StatelessComponent<Props> = props => {
  const handleOnChangeRole = useCallback(
    (role: GQLUSER_ROLE_RL) => {
      if (role === props.role) {
        return;
      }
      props.updateUserRole({ userID: props.userID, role });
    },
    [props.userID, props.role, props.updateUserRole]
  );
  return <RoleChange onChangeRole={handleOnChangeRole} role={props.role} />;
};

const enhanced = withUpdateUserRoleMutation(RoleChangeContainer);

export default enhanced;
