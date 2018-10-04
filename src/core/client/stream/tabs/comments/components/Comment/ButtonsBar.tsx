import React, { StatelessComponent } from "react";

import { Flex } from "talk-ui/components";

const ButtonsBar: StatelessComponent = props => {
  return (
    <Flex direction="row" itemGutter="half">
      {props.children}
    </Flex>
  );
};

export default ButtonsBar;
