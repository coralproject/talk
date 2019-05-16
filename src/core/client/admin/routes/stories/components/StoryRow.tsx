import { Link } from "found";
import React, { FunctionComponent } from "react";

import NotAvailable from "coral-admin/components/NotAvailable";
import { getModerationLink } from "coral-admin/helpers";
import { PropTypesOf } from "coral-framework/types";
import { TableCell, TableRow, TextLink } from "coral-ui/components";

import StatusChangeContainer from "../containers/StatusChangeContainer";
import StatusText from "./StatusText";

import styles from "./StoryRow.css";

interface Props {
  canChangeStatus: boolean;
  storyID: string;
  title: string | null;
  author: string | null;
  publishDate: string | null;
  status: PropTypesOf<typeof StatusChangeContainer>["status"];
}

const UserRow: FunctionComponent<Props> = props => (
  <TableRow>
    <TableCell className={styles.titleColumn}>
      <Link
        to={getModerationLink("default", props.storyID)}
        Component={TextLink}
      >
        {props.title || <NotAvailable />}
      </Link>
    </TableCell>
    <TableCell className={styles.authorColumn}>
      {props.author || <NotAvailable />}
    </TableCell>
    <TableCell className={styles.publishDateColumn}>
      {props.publishDate || <NotAvailable />}
    </TableCell>
    <TableCell className={styles.statusColumn}>
      {props.canChangeStatus ? (
        <StatusChangeContainer storyID={props.storyID} status={props.status} />
      ) : (
        <StatusText>{props.status}</StatusText>
      )}
    </TableCell>
  </TableRow>
);

export default UserRow;
