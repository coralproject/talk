import cn from "classnames";
import React from "react";
import { StatelessComponent } from "react";

import { Flex, MatchMedia } from "talk-ui/components";

export interface TopBarLeftProps {
  className?: string;
  children: React.ReactNode;
}

const TopBarLeft: StatelessComponent<TopBarLeftProps> = props => {
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

export default TopBarLeft;
