import React, { FunctionComponent } from "react";

import NotAvailable from "coral-admin/components/NotAvailable";
import { PropTypesOf } from "coral-framework/types";
import { TableCell, TableRow, TextLink } from "coral-ui/components";

import UserRole from "./UserRole";
import UserStatus from "./UserStatus";

import styles from "./UserRow.css";

interface Props {
  userID: string;
  username: string | null;
  email: string | null;
  memberSince: string;
  user: PropTypesOf<typeof UserRole>["user"] &
    PropTypesOf<typeof UserStatus>["user"];
  viewer: PropTypesOf<typeof UserRole>["viewer"];
}

const UserRow: FunctionComponent<Props> = props => (
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
      <UserRole user={props.user} viewer={props.viewer} />
    </TableCell>
    <TableCell className={styles.statusColumn}>
      <UserStatus user={props.user} />
    </TableCell>
  </TableRow>
);

export default UserRow;
