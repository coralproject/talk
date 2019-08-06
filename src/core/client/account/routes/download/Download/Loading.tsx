import React, { FunctionComponent } from "react";

import { Delay, Flex, HorizontalGutter, Spinner } from "coral-ui/components";

const Loading: FunctionComponent = () => (
  <HorizontalGutter size="double">
    <Flex justifyContent="center">
      <Delay>
        <Spinner />
      </Delay>
    </Flex>
  </HorizontalGutter>
);

export default Loading;
