import { Link } from "found";
import React, { FunctionComponent } from "react";

import NotAvailable from "coral-admin/components/NotAvailable";
import { getModerationLink } from "coral-admin/helpers";
import { PropTypesOf } from "coral-framework/types";
import { TableCell, TableRow, TextLink } from "coral-ui/components";

import styles from "./StoryRow.css";
import StoryStatus from "./StoryStatus";

interface Props {
  storyID: string;
  title: string | null;
  author: string | null;
  publishDate: string | null;
  story: PropTypesOf<typeof StoryStatus>["story"];
  viewer: PropTypesOf<typeof StoryStatus>["viewer"];
}

const UserRow: FunctionComponent<Props> = props => (
  <TableRow>
    <TableCell className={styles.titleColumn}>
      <Link to={getModerationLink("default", props.storyID)} as={TextLink}>
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
      <StoryStatus story={props.story} viewer={props.viewer} />
    </TableCell>
  </TableRow>
);

export default UserRow;
