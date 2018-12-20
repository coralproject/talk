import React, { StatelessComponent } from "react";

import { Delay, Flex, Spinner } from "talk-ui/components";

import Main from "./Main";
import Title from "./Title";

import styles from "./DecisionHistoryLoading.css";

const DecisionHistoryLoading: StatelessComponent = () => (
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
