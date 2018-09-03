import cn from "classnames";
import React from "react";
import { StatelessComponent } from "react";

import { Flex, MatchMedia } from "talk-ui/components";

export interface TopBarProps {
  className?: string;
  children: React.ReactNode;
}

const TopBar: StatelessComponent<TopBarProps> = props => {
  const rootClassName = cn(props.className);
  return (
    <MatchMedia gtWidth="xs">
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
