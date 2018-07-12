import cn from "classnames";
import React from "react";
import { StatelessComponent } from "react";

import { Flex, MatchMedia } from "talk-ui/components";

import * as styles from "./TopBar.css";

export interface TopBarProps {
  className?: string;
  children: React.ReactNode;
}

const TopBar: StatelessComponent<TopBarProps> = props => {
  const rootClassName = cn(styles.root, props.className);
  return (
    <MatchMedia minWidth="xs">
      {matches => (
        <Flex
          className={rootClassName}
          alignItems="baseline"
          direction={matches ? "row" : "column"}
          itemGutter={matches ? true : "half"}
        >
          {props.children}
        </Flex>
      )}
    </MatchMedia>
  );
};

export default TopBar;
