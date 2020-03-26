import React, { FunctionComponent } from "react";

import { Flex } from "coral-ui/components/v2";

interface Props {
  className?: string;
  children?: any;
}

const ButtonsBar: FunctionComponent<Props> = ({ className, children }) => {
  return (
    <Flex
      direction="row"
      itemGutter="half"
      alignItems="center"
      justifyContent="space-between"
      className={className}
    >
      {children}
    </Flex>
  );
};

export default ButtonsBar;
