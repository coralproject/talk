import React, { StatelessComponent } from "react";

import NotAvailable from "talk-admin/components/NotAvailable";
import { PropTypesOf } from "talk-framework/types";
import { TableCell, TableRow, TextLink } from "talk-ui/components";

import RoleChangeContainer from "../containers/RoleChangeContainer";
import RoleText from "./RoleText";

import styles from "./UserRow.css";

interface Props {
  canChangeRole: boolean;
  userID: string;
  username: string | null;
  email: string | null;
  memberSince: string;
  role: PropTypesOf<typeof RoleChangeContainer>["role"];
}

const UserRow: StatelessComponent<Props> = props => (
  <TableRow>
    <TableCell className={styles.usernameColumn}>
      {props.username || <NotAvailable />}
    </TableCell>
    <TableCell className={styles.emailColumn}>
      {<TextLink href={`mailto:${props.email}`}>{props.email}</TextLink> || (
        <NotAvailable />
      )}
    </TableCell>
    <TableCell className={styles.memberSinceColumn}>
      {props.memberSince}
    </TableCell>
    <TableCell className={styles.roleColumn}>
      {props.canChangeRole ? (
        <RoleChangeContainer userID={props.userID} role={props.role} />
      ) : (
        <RoleText>{props.role}</RoleText>
      )}
    </TableCell>
  </TableRow>
);

export default UserRow;
