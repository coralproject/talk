import React, { FunctionComponent } from "react";

import { Delay, Flex, Spinner } from "coral-ui/components/v2";

const Loading: FunctionComponent = () => (
  <Flex justifyContent="center">
    <Delay>
      <Spinner />
    </Delay>
  </Flex>
);

export default Loading;
