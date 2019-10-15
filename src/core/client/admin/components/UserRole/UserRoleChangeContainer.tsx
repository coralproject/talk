import React, { FunctionComponent, useCallback } from "react";

import { Ability, can } from "coral-admin/permissions";
import {
  graphql,
  useMutation,
  withFragmentContainer,
} from "coral-framework/lib/relay";
import { GQLUSER_ROLE_RL } from "coral-framework/schema";

import { UserRoleChangeContainer_user } from "coral-admin/__generated__/UserRoleChangeContainer_user.graphql";
import { UserRoleChangeContainer_viewer } from "coral-admin/__generated__/UserRoleChangeContainer_viewer.graphql";

import ButtonPadding from "../ButtonPadding";
import UpdateUserRoleMutation from "./UpdateUserRoleMutation";
import UserRoleChange from "./UserRoleChange";
import UserRoleText from "./UserRoleText";

interface Props {
  viewer: UserRoleChangeContainer_viewer;
  user: UserRoleChangeContainer_user;
}

const UserRoleChangeContainer: FunctionComponent<Props> = props => {
  const updateUserRole = useMutation(UpdateUserRoleMutation);
  const handleOnChangeRole = useCallback(
    (role: GQLUSER_ROLE_RL) => {
      if (role === props.user.role) {
        return;
      }
      updateUserRole({ userID: props.user.id, role });
    },
    [props.user.id, props.user.role, updateUserRole]
  );

  const canChangeRole =
    props.viewer.id !== props.user.id && can(props.viewer, Ability.CHANGE_ROLE);

  if (canChangeRole) {
    return (
      <UserRoleChange
        onChangeRole={handleOnChangeRole}
        role={props.user.role}
      />
    );
  }
  return (
    <ButtonPadding>
      <UserRoleText>{props.user.role}</UserRoleText>
    </ButtonPadding>
  );
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment UserRoleChangeContainer_viewer on User {
      id
      role
    }
  `,
  user: graphql`
    fragment UserRoleChangeContainer_user on User {
      id
      role
    }
  `,
})(UserRoleChangeContainer);

export default enhanced;
