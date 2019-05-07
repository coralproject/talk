import cn from "classnames";
import React, { FunctionComponent } from "react";

import TranslatedRole from "talk-admin/components/TranslatedRole";
import { GQLUSER_ROLE } from "talk-framework/schema";
import { PropTypesOf } from "talk-ui/types";

import styles from "./RoleText.css";

interface Props {
  children: PropTypesOf<typeof TranslatedRole>["children"];
}

const RoleText: FunctionComponent<Props> = props => (
  <TranslatedRole
    container={
      <span
        className={cn(styles.root, {
          [styles.commenter]: props.children === GQLUSER_ROLE.COMMENTER,
        })}
      />
    }
  >
    {props.children}
  </TranslatedRole>
);

export default RoleText;
