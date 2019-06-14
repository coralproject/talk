import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

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
}

const SortMenu: FunctionComponent<Props> = props => (
  <MatchMedia ltWidth="sm">
    {matches => (
      <Flex
        className={props.className}
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
          <Option value="REACTION_DESC">{props.reactionSortLabel}</Option>
        </SelectField>
      </Flex>
    )}
  </MatchMedia>
);
export default SortMenu;
