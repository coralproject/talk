import cn from "classnames";
import React from "react";
import { FunctionComponent } from "react";

import { Flex, MatchMedia } from "coral-ui/components";

export interface TopBarLeftProps {
  className?: string;
  children: React.ReactNode;
}

const TopBarLeft: FunctionComponent<TopBarLeftProps> = props => {
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
