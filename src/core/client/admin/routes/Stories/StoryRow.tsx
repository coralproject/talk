import { Link } from "found";
import React, { FunctionComponent } from "react";

import NotAvailable from "coral-admin/components/NotAvailable";
import { getModerationLink } from "coral-framework/helpers";
import { PropTypesOf } from "coral-framework/types";
import { TableCell, TableRow, TextLink } from "coral-ui/components/v2";

import StoryStatus from "./StoryStatus";

import styles from "./StoryRow.css";

interface Props {
  storyID: string;
  title: string | null;
  author: string | null;
  publishDate: string | null;
  story: PropTypesOf<typeof StoryStatus>["story"];
  viewer: PropTypesOf<typeof StoryStatus>["viewer"];
  siteName: string;
  siteID: string;
  multisite: boolean;
}

const UserRow: FunctionComponent<Props> = props => (
  <TableRow>
    <TableCell className={styles.titleColumn}>
      <Link to={getModerationLink({ storyID: props.storyID })} as={TextLink}>
        {props.title || <NotAvailable />}
      </Link>
    </TableCell>
    <TableCell className={styles.authorColumn}>
      {props.author || <NotAvailable />}
    </TableCell>
    {props.multisite && (
      <TableCell className={styles.siteColumn}>
        <Link to={getModerationLink({ siteID: props.siteID })} as={TextLink}>
          {props.siteName}
        </Link>
      </TableCell>
    )}
    <TableCell className={styles.publishDateColumn}>
      {props.publishDate || <NotAvailable />}
    </TableCell>
    <TableCell className={styles.statusColumn}>
      <StoryStatus story={props.story} viewer={props.viewer} />
    </TableCell>
  </TableRow>
);

export default UserRow;
