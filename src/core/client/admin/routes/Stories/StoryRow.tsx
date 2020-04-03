import cn from "classnames";
import { Button } from "coral-ui/components";
import { Link } from "found";
import React, { FunctionComponent } from "react";

import NotAvailable from "coral-admin/components/NotAvailable";
import { getModerationLink } from "coral-framework/helpers";
import { PropTypesOf } from "coral-framework/types";
import {
  HorizontalGutter,
  TableCell,
  TableRow,
  TextLink,
} from "coral-ui/components/v2";

import StoryStatus from "./StoryStatus";

import styles from "./StoryRow.css";

interface Props {
  storyID: string;
  title: string | null;
  author: string | null;
  section: string | null;
  publishDate: string | null;
  story: PropTypesOf<typeof StoryStatus>["story"];
  viewer: PropTypesOf<typeof StoryStatus>["viewer"];
  siteName: string;
  siteID: string;
  multisite: boolean;
  reportedCount: number | null;
  pendingCount: number | null;
  totalCount: number;
  onSetSearchFilter: (search: string) => void;
}

const UserRow: FunctionComponent<Props> = props => (
  <TableRow>
    <TableCell className={styles.titleColumn}>
      <HorizontalGutter>
        <p>
          <Link
            to={getModerationLink({ storyID: props.storyID })}
            as={TextLink}
          >
            {props.title || <NotAvailable />}
          </Link>
        </p>
        {(props.author || props.publishDate || props.section) && (
          <p className={styles.meta}>
            {props.section && (
              <Button
                color="dark"
                variant="filled"
                onClick={() => props.onSetSearchFilter(`"${props.section}"`)}
                className={styles.sectionNameButton}
              >
                {props.section}
              </Button>
            )}
            <span className={styles.authorName}>{props.author}</span>
            {props.publishDate}
          </p>
        )}
      </HorizontalGutter>
    </TableCell>
    <TableCell
      className={cn(styles.reportedCountColumn, {
        [styles.boldColumn]: props.reportedCount && props.reportedCount > 0,
      })}
    >
      {props.reportedCount}
    </TableCell>
    <TableCell
      className={cn(styles.pendingCountColumn, {
        [styles.boldColumn]: props.pendingCount && props.pendingCount > 0,
      })}
    >
      {props.pendingCount}
    </TableCell>
    <TableCell
      className={cn(styles.totalCountColumn, {
        [styles.boldColumn]: props.totalCount && props.totalCount > 0,
      })}
    >
      {props.totalCount}
    </TableCell>
    <TableCell className={styles.statusColumn}>
      <StoryStatus story={props.story} viewer={props.viewer} />
    </TableCell>
  </TableRow>
);

export default UserRow;
