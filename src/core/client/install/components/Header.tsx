import React, { StatelessComponent } from "react";
import { Flex, Typography } from "talk-ui/components";

const Header: StatelessComponent = () => {
  return (
    <Flex alignItems="center" justifyContent="center" direction="column">
      <Typography>The Coral Project</Typography>
      <Typography variant="heading1">Talk Installation Wizard</Typography>
    </Flex>
  );
};

export default Header;
