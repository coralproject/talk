import React, { StatelessComponent } from "react";

import { PropTypesOf } from "talk-framework/types";
import { TableCell, TableRow, TextLink } from "talk-ui/components";

import RoleChangeContainer from "../containers/RoleChangeContainer";
import NotAvailable from "./NotAvailable";
import RoleText from "./RoleText";

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
    <TableCell>{props.username || <NotAvailable />}</TableCell>
    <TableCell>
      {<TextLink href={`mailto:${props.email}`}>{props.email}</TextLink> || (
        <NotAvailable />
      )}
    </TableCell>
    <TableCell>{props.memberSince}</TableCell>
    <TableCell>
      {props.canChangeRole ? (
        <RoleChangeContainer userID={props.userID} role={props.role} />
      ) : (
        <RoleText>{props.role}</RoleText>
      )}
    </TableCell>
  </TableRow>
);

export default UserRow;
