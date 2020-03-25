import React, { FunctionComponent } from "react";

import { Flex } from "coral-ui/components";

const ButtonsBar: FunctionComponent = (props) => {
  return (
    <Flex direction="row" itemGutter="half" alignItems="center">
      {props.children}
    </Flex>
  );
};

export default ButtonsBar;
