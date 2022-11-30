import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";
import { BaseButton, Flex, Icon, RelativeTime } from "coral-ui/components/v2";

import EditedMarker from "./EditedMarker";

import styles from "./CommentToggle.css";

export interface Props {
  className?: string;
  username?: string | null;
  usernameEl: React.ReactNode;
  body: string | null;
  createdAt: string;
  topBarRight?: React.ReactNode;
  footer?: React.ReactNode;
  showEditedMarker?: boolean;
  highlight?: boolean;
  parentAuthorName?: string | null;
  userTags?: React.ReactNode;
  collapsed?: boolean;
  toggleCollapsed?: () => void;
}

const CommentToggle: FunctionComponent<Props> = (props) => {
  const ariaLocalizationId = props.username
    ? "comments-expand-toggle-with-username"
    : "comments-expand-toggle-username";
  return (
    <Localized
      id={ariaLocalizationId}
      attrs={{ "aria-label": true }}
      vars={{ username: props.username }}
    >
      <BaseButton
        onClick={props.toggleCollapsed}
        className={cn(styles.root, CLASSES.comment.collapseToggle.$root)}
        aria-label={"Expand comment thread"}
      >
        <Flex alignItems="flex-start" spacing={1}>
          <Icon
            className={cn(styles.icon, CLASSES.comment.collapseToggle.icon)}
          >
            add
          </Icon>
          <Flex
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className={cn(styles.inner, CLASSES.comment.topBar.$root)}
            wrap
          >
            <Flex
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              wrap
            >
              <Flex
                className={styles.username}
                direction="row"
                alignItems="center"
                itemGutter="half"
              >
                {props.usernameEl && props.usernameEl}
                {props.userTags}
              </Flex>
              <Flex direction="row" alignItems="baseline" itemGutter wrap>
                <RelativeTime
                  className={cn(
                    styles.timestamp,
                    CLASSES.comment.topBar.timestamp
                  )}
                  date={props.createdAt}
                />
                {props.showEditedMarker && (
                  <EditedMarker className={CLASSES.comment.topBar.edited} />
                )}
              </Flex>
            </Flex>
            {props.topBarRight && <div>{props.topBarRight}</div>}
          </Flex>
        </Flex>
      </BaseButton>
    </Localized>
  );
};

export default CommentToggle;
