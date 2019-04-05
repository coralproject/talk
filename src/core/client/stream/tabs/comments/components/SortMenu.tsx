import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import {
  Flex,
  Icon,
  MatchMedia,
  Option,
  SelectField,
  Typography,
} from "talk-ui/components";

import Divider from "./Divider";
import * as styles from "./SortMenu.css";

interface Props {
  orderBy:
    | "CREATED_AT_ASC"
    | "CREATED_AT_DESC"
    | "REPLIES_DESC"
    | "REACTION_DESC"
    | "%future added value";
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  reactionName: string;
}

const SortMenu: StatelessComponent<Props> = props => (
  <MatchMedia ltWidth="sm">
    {matches => (
      <div>
        <Flex justifyContent="flex-end" alignItems="center" itemGutter>
          {!matches && (
            <Localized id="comments-sortMenu-sortBy">
              <Typography
                variant="bodyCopyBold"
                container={<label htmlFor="talk-comments-sortMenu" />}
              >
                Sort By
              </Typography>
            </Localized>
          )}
          <SelectField
            id="talk-comments-sortMenu"
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
            <Localized
              id="comments-sortMenu-mostReactions"
              $reactionName={props.reactionName}
            >
              <Option value="REACTION_DESC">Most {props.reactionName}</Option>
            </Localized>
          </SelectField>
        </Flex>
        <Divider />
      </div>
    )}
  </MatchMedia>
);
export default SortMenu;
