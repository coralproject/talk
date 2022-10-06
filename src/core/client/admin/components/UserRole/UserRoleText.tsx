import cn from "classnames";
import React, { FunctionComponent } from "react";

import TranslatedRole from "coral-admin/components/TranslatedRole";
import { GQLUSER_ROLE } from "coral-framework/schema";
import { PropTypesOf } from "coral-ui/types";

import styles from "./UserRoleText.css";

type Props = Omit<PropTypesOf<typeof TranslatedRole>, "container">;

interface UserRoleTextProps {
  children?: React.ReactNode;
}

const UserRoleText: FunctionComponent<Props & UserRoleTextProps> = (props) => (
  <TranslatedRole
    container={
      <span
        className={cn(styles.root, {
          [styles.commenter]:
            props.children === GQLUSER_ROLE.COMMENTER ||
            props.children === GQLUSER_ROLE.MEMBER,
        })}
      />
    }
    {...props}
  />
);

export default UserRoleText;
