import cn from "classnames";
import { Link } from "found";
import React, { FunctionComponent } from "react";

import NotAvailable from "coral-admin/components/NotAvailable";
import { getModerationLink } from "coral-framework/helpers";
import { PropTypesOf } from "coral-framework/types";
import {
  HorizontalGutter,
  Icon,
  TableCell,
  TableRow,
  TextLink,
} from "coral-ui/components/v2";

import StoryActionsContainer from "./StoryActions";
import StoryStatusContainer from "./StoryStatus";

import styles from "./StoryRow.css";

interface Props {
  storyID: string;
  title: string | null;
  author: string | null;
  readOnly: boolean;
  publishDate: string | null;
  story: PropTypesOf<typeof StoryActionsContainer>["story"] &
    PropTypesOf<typeof StoryStatusContainer>["story"];
  viewer: PropTypesOf<typeof StoryActionsContainer>["viewer"];
  siteName: string;
  siteID: string;
  multisite: boolean;
  reportedCount: number | null;
  pendingCount: number | null;
  totalCount: number;
  viewerCount: number | null;
  onOpenInfoDrawer: () => void;
}

const UserRow: FunctionComponent<Props> = (props) => (
  <TableRow>
    <TableCell className={styles.titleColumn}>
      <HorizontalGutter>
        <p>
          {!props.readOnly ? (
            <Link
              to={getModerationLink({ storyID: props.storyID })}
              as={TextLink}
            >
              {props.title || <NotAvailable />}
            </Link>
          ) : (
            props.title || <NotAvailable />
          )}
          <Icon
            onClick={props.onOpenInfoDrawer}
            className={styles.infoDrawerButton}
            size="sm"
            role="button"
            aria-label="Open story info drawer"
          >
            open_in_new
          </Icon>
        </p>
        {(props.author || props.publishDate || !!props.viewerCount) && (
          <p className={styles.meta}>
            {!!props.author && (
              <span className={cn(styles.authorName, styles.metaElement)}>
                {props.author}
              </span>
            )}

            {!!props.publishDate && (
              <span className={styles.metaElement}>{props.publishDate} </span>
            )}

            {!!props.viewerCount && (
              <span className={styles.readingNow}>
                {props.viewerCount} reading now
              </span>
            )}
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
      <StoryStatusContainer story={props.story} />
    </TableCell>
    <TableCell className={styles.actionsColumn}>
      {!props.readOnly && (
        <StoryActionsContainer story={props.story} viewer={props.viewer} />
      )}
    </TableCell>
  </TableRow>
);

export default UserRow;
