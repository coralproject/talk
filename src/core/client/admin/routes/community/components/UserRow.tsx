import cn from "classnames";
import React, { StatelessComponent } from "react";

import TranslatedRole from "talk-admin/components/TranslatedRole";
import { TableCell, TableRow, TextLink } from "talk-ui/components";

import styles from "./UserRow.css";

interface Props {
  username: string | null;
  email: string | null;
  memberSince: string;
  role: "COMMENTER" | "ADMIN" | "MODERATOR" | "STAFF" | "%future added value";
}

const UserRow: StatelessComponent<Props> = props => (
  <TableRow>
    <TableCell>{props.username || "Not available"}</TableCell>
    <TableCell>
      {<TextLink href={`mailto:${props.email}`}>{props.email}</TextLink> ||
        "Not available"}
    </TableCell>
    <TableCell>{props.memberSince}</TableCell>
    <TableCell>
      <TranslatedRole
        container={
          <span
            className={cn({ [styles.boldRole]: props.role !== "COMMENTER" })}
          />
        }
      >
        {props.role}
      </TranslatedRole>
    </TableCell>
  </TableRow>
);

export default UserRow;
