import cn from "classnames";
import React, { FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";

import Indent from "../Indent";
import Comment, { CommentProps } from "./Comment";

import styles from "./IndentedComment.css";
import { Flex } from "coral-ui/components/v2";

export interface IndentedCommentProps extends Omit<CommentProps, "ref"> {
  classNameIndented?: string;
  indentLevel?: number;
  blur?: boolean;
  toggleCollapsed?: () => void;
  staticUsername: React.ReactNode;
  staticTopBarRight: React.ReactNode;
  tags?: React.ReactNode | null;
  badges?: React.ReactNode | null;
  enableJumpToParent?: boolean;
  username?: string | null;
  featuredCommenter?: boolean | null;
  topCommenterEnabled?: boolean | null;
  newCommenter?: boolean | null;
  newCommenterEnabled?: boolean | null;
}

const IndentedComment: FunctionComponent<IndentedCommentProps> = ({
  staticTopBarRight,
  staticUsername,
  indentLevel,
  toggleCollapsed,
  blur,
  classNameIndented,
  ...rest
}) => {
  // const collapseCommentsLocalizationId = rest.username
  //   ? "comments-collapse-toggle-with-username"
  //   : "comments-collapse-toggle-without-username";
  return (
    <Indent
      level={indentLevel}
      collapsed={rest.collapsed}
      className={cn(
        {
          [styles.blur]: blur,
          [CLASSES.comment.collapseToggle.collapsed]: rest.collapsed,
        },
        CLASSES.comment.collapseToggle.indent
      )}
      classNameIndent={classNameIndented}
    >
      <Flex spacing={3}>
        {rest.username ? (
          <div className={styles.userAvatar}>
            <span>{rest.username[0]}</span>
          </div>
        ) : null}
        <Comment {...rest} />
      </Flex>

      {/* {rest.collapsed ? (*/}
      {/*    <CommentToggle*/}
      {/*        {...rest}*/}
      {/*        toggleCollapsed={toggleCollapsed}*/}
      {/*        usernameEl={staticUsername}*/}
      {/*        username={rest.username}*/}
      {/*        topBarRight={staticTopBarRight}*/}
      {/*    />*/}
      {/* ) : (*/}
      {/*  <Flex alignItems="flex-start" spacing={1}>*/}
      {/*    {toggleCollapsed && (*/}
      {/*      <Localized*/}
      {/*        id={collapseCommentsLocalizationId}*/}
      {/*        attrs={{ "aria-label": true }}*/}
      {/*        vars={{ username: rest.username ?? "" }}*/}
      {/*      >*/}
      {/*        <BaseButton*/}
      {/*          onClick={toggleCollapsed}*/}
      {/*          aria-label={`Hide comment by ${rest.username} and its replies`}*/}
      {/*          className={cn(*/}
      {/*            styles.toggleButton,*/}
      {/*            CLASSES.comment.collapseToggle.$root*/}
      {/*          )}*/}
      {/*          aria-expanded="true"*/}
      {/*        >*/}
      {/*          <SvgIcon*/}
      {/*            className={cn(*/}
      {/*              styles.icon,*/}
      {/*              CLASSES.comment.collapseToggle.icon*/}
      {/*            )}*/}
      {/*            size="xs"*/}
      {/*            Icon={SubtractIcon}*/}
      {/*          />*/}
      {/*        </BaseButton>*/}
      {/*      </Localized>*/}
      {/*    )}*/}
      {/*    <Comment {...rest} />*/}
      {/*  </Flex>*/}
      {/* )}*/}
    </Indent>
  );
};

export default IndentedComment;
