import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, useCallback } from "react";

import { useViewerEvent } from "coral-framework/lib/events";
import CLASSES from "coral-stream/classes";
import { OpenSortMenuEvent } from "coral-stream/events";
import {
  Flex,
  Icon,
  MatchMedia,
  Option,
  SelectField,
  Typography,
} from "coral-ui/components";

import * as styles from "./SortMenu.css";

interface Props {
  className?: string;
  orderBy:
    | "CREATED_AT_ASC"
    | "CREATED_AT_DESC"
    | "REPLIES_DESC"
    | "REACTION_DESC"
    | "%future added value";
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  reactionSortLabel: string;
  isQA?: boolean;
}

const SortMenu: FunctionComponent<Props> = props => {
  const emitOpenSortMenuEvent = useViewerEvent(OpenSortMenuEvent);
  const onClickSelectField = useCallback(() => emitOpenSortMenuEvent(), [
    emitOpenSortMenuEvent,
  ]);
  return (
    <MatchMedia ltWidth="sm">
      {matches => (
        <Flex
          className={cn(props.className, CLASSES.sortMenu)}
          justifyContent="flex-end"
          alignItems="center"
          itemGutter
        >
          {!matches && (
            <Localized id="comments-sortMenu-sortBy">
              <Typography
                variant="bodyCopyBold"
                container={<label htmlFor="coral-comments-sortMenu" />}
              >
                Sort By
              </Typography>
            </Localized>
          )}
          <SelectField
            id="coral-comments-sortMenu"
            value={props.orderBy}
            onChange={props.onChange}
            onClick={onClickSelectField}
            afterWrapper={(matches && <Icon>sort</Icon>) || undefined}
            classes={{
              select: (matches && styles.mobileSelect) || undefined,
              afterWrapper: (matches && styles.mobileAfterWrapper) || undefined,
            }}
          >
            <Localized id="comments-sortMenu-newest">
              <Option value="CREATED_AT_DESC">Newest</Option>
            </Localized>
            <Localized id="comments-sortMenu-oldest">
              <Option value="CREATED_AT_ASC">Oldest</Option>
            </Localized>
            <Localized id="comments-sortMenu-mostReplies">
              <Option value="REPLIES_DESC">Most Replies</Option>
            </Localized>
            {props.isQA ? (
              <Localized id="qa-sortMenu-mostVoted">
                <Option value="REACTION_DESC">Most Voted</Option>
              </Localized>
            ) : (
              <Option value="REACTION_DESC">{props.reactionSortLabel}</Option>
            )}
          </SelectField>
        </Flex>
      )}
    </MatchMedia>
  );
};
export default SortMenu;
