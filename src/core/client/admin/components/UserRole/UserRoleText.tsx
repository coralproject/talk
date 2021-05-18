import cn from "classnames";
import React, { FunctionComponent } from "react";

import TranslatedRole from "coral-admin/components/TranslatedRole";
import { GQLUSER_ROLE } from "coral-admin/schema";
import { PropTypesOf } from "coral-ui/types";

import styles from "./UserRoleText.css";

type Props = Omit<PropTypesOf<typeof TranslatedRole>, "container">;

const UserRoleText: FunctionComponent<Props> = (props) => (
  <TranslatedRole
    container={
      <span
        className={cn(styles.root, {
          [styles.commenter]: props.children === GQLUSER_ROLE.COMMENTER,
        })}
      />
    }
    {...props}
  />
);

export default UserRoleText;
