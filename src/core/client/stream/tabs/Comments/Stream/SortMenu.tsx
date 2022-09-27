import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, useCallback } from "react";

import { useViewerEvent } from "coral-framework/lib/events";
import CLASSES from "coral-stream/classes";
import { OpenSortMenuEvent } from "coral-stream/events";
import { AriaInfo, Flex, Option, SelectField } from "coral-ui/components/v2";

import styles from "./SortMenu.css";
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
  showLabel?: boolean;
  fullWidth?: boolean;
  isQA?: boolean;
}

const SortMenu: FunctionComponent<Props> = (props) => {
  const emitOpenSortMenuEvent = useViewerEvent(OpenSortMenuEvent);
  const onClickSelectField = useCallback(
    () => emitOpenSortMenuEvent(),
    [emitOpenSortMenuEvent]
  );
  let label = (
    <Localized id="comments-sortMenu-sortBy">
      <label className={styles.label} htmlFor="coral-comments-sortMenu">
        Sort by
      </label>
    </Localized>
  );
  if (!props.showLabel) {
    label = <AriaInfo>{label}</AriaInfo>;
  }
  return (
    <Flex
      className={cn(props.className, CLASSES.sortMenu)}
      justifyContent="flex-end"
      alignItems="center"
      itemGutter
    >
      {label}
      <SelectField
        id="coral-comments-sortMenu"
        value={props.orderBy}
        onChange={props.onChange}
        onClick={onClickSelectField}
        fullWidth={props.fullWidth}
        classes={{
          select: styles.select,
          selectFont: styles.selectFont,
          selectColor: styles.selectColor,
        }}
        className={CLASSES.sortMenu}
      >
        <Localized id="comments-sortMenu-newest">
          <Option value="CREATED_AT_DESC">Newest</Option>
        </Localized>
        <Localized id="comments-sortMenu-oldest">
          <Option value="CREATED_AT_ASC">Oldest</Option>
        </Localized>
        <Localized id="comments-sortMenu-mostReplies">
          <Option value="REPLIES_DESC">Most replies</Option>
        </Localized>
        {props.isQA ? (
          <Localized id="qa-sortMenu-mostVoted">
            <Option value="REACTION_DESC">Most voted</Option>
          </Localized>
        ) : (
          <Option value="REACTION_DESC">{props.reactionSortLabel}</Option>
        )}
      </SelectField>
    </Flex>
  );
};
export default SortMenu;
