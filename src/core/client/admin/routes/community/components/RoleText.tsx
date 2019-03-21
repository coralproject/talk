import cn from "classnames";
import React, { StatelessComponent } from "react";

import TranslatedRole from "talk-admin/components/TranslatedRole";
import { PropTypesOf } from "talk-ui/types";

import styles from "./RoleText.css";

interface Props {
  children: PropTypesOf<typeof TranslatedRole>["children"];
}

const RoleText: StatelessComponent<Props> = props => (
  <TranslatedRole
    container={
      <span
        className={cn(styles.root, {
          [styles.commenter]: props.children === "COMMENTER",
        })}
      />
    }
  >
    {props.children}
  </TranslatedRole>
);

export default RoleText;
