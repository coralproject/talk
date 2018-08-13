import React, { StatelessComponent } from "react";
import { Flex, Typography } from "talk-ui/components";

const PoweredBy: StatelessComponent = () => {
  return (
    <Flex itemGutter="half">
      <Typography variant="bodyCopy">Powered by</Typography>
      <Typography variant="heading4">The Coral Project</Typography>
    </Flex>
  );
};

export default PoweredBy;
