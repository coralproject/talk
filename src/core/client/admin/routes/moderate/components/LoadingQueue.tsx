import React, { FunctionComponent } from "react";

import { Flex, Spinner } from "talk-ui/components";

const LoadingQueue: FunctionComponent = () => (
  <Flex justifyContent="center" data-testid="loading-moderate-container">
    <Spinner />
  </Flex>
);

export default LoadingQueue;
