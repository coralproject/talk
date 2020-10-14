import cn from "classnames";
import React, { FunctionComponent } from "react";

import { Flex, MatchMedia } from "coral-ui/components/v2";

export interface TopBarLeftProps {
  className?: string;
  children: React.ReactNode;
}

const TopBarLeft: FunctionComponent<TopBarLeftProps> = (props) => {
  const rootClassName = cn(props.className);
  return (
    <MatchMedia gtWidth="xs">
      {(matches) => (
        <Flex
          className={rootClassName}
          alignItems={matches ? "center" : "baseline"}
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
