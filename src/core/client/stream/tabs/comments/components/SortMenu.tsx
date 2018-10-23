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
    | "RESPECT_DESC"
    | "%future added value";
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SortMenu: StatelessComponent<Props> = props => (
  <MatchMedia ltWidth="sm">
    {matches => (
      <div>
        <Flex justifyContent="flex-end" alignItems="center" itemGutter>
          {!matches && <Typography variant="bodyCopyBold">Sort By</Typography>}
          <SelectField
            value={props.orderBy}
            onChange={props.onChange}
            afterWrapper={(matches && <Icon>sort</Icon>) || undefined}
            classes={{
              select: (matches && styles.mobileSelect) || undefined,
              afterWrapper: (matches && styles.mobileAfterWrapper) || undefined,
            }}
          >
            <Option value="CREATED_AT_DESC">Newest</Option>
            <Option value="CREATED_AT_ASC">Oldest</Option>
            <Option value="REPLIES_DESC">Most Replies</Option>
            <Option value="RESPECT_DESC">Most Reactions</Option>
          </SelectField>
        </Flex>
        <Divider />
      </div>
    )}
  </MatchMedia>
);
export default SortMenu;
