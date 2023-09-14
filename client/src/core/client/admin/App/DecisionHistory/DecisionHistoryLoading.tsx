import React, { FunctionComponent } from "react";

import { Delay, Flex, Spinner } from "coral-ui/components/v2";

import Main from "./Main";
import Title from "./Title";

import styles from "./DecisionHistoryLoading.css";

const DecisionHistoryLoading: FunctionComponent = () => (
  <div data-testid="decisionHistory-loading-container">
    <Title />
    <Main>
      <Flex
        justifyContent="center"
        alignItems="center"
        className={styles.container}
      >
        <Delay>
          <Spinner size="sm" />
        </Delay>
      </Flex>
    </Main>
  </div>
);

export default DecisionHistoryLoading;
