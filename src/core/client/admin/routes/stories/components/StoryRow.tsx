import React, { StatelessComponent } from "react";

import NotAvailable from "talk-admin/components/NotAvailable";
import { PropTypesOf } from "talk-framework/types";
import { TableCell, TableRow } from "talk-ui/components";

import StatusChangeContainer from "../containers/StatusChangeContainer";
import StatusText from "./StatusText";

interface Props {
  canChangeStatus: boolean;
  storyID: string;
  title: string | null;
  author: string | null;
  publishDate: string | null;
  status: PropTypesOf<typeof StatusChangeContainer>["status"];
}

const UserRow: StatelessComponent<Props> = props => (
  <TableRow>
    <TableCell>{props.title || <NotAvailable />}</TableCell>
    <TableCell>{props.author || <NotAvailable />}</TableCell>
    <TableCell>{props.publishDate || <NotAvailable />}</TableCell>
    <TableCell>
      {props.canChangeStatus ? (
        <StatusChangeContainer storyID={props.storyID} status={props.status} />
      ) : (
        <StatusText>{props.status}</StatusText>
      )}
    </TableCell>
  </TableRow>
);

export default UserRow;
