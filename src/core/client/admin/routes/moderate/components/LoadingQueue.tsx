import React, { StatelessComponent } from "react";

import { Flex, Spinner } from "talk-ui/components";

const LoadingQueue: StatelessComponent = () => (
  <Flex justifyContent="center" data-testid="loading-moderate-container">
    <Spinner />
  </Flex>
);

export default LoadingQueue;
