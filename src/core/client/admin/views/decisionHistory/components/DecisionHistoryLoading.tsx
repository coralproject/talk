import React, { StatelessComponent } from "react";

import { Delay, Flex, Spinner } from "talk-ui/components";

import styles from "./DecisionHistoryLoading.css";
import Main from "./Main";
import Title from "./Title";

const DecisionHistoryLoading: StatelessComponent = () => (
  <div data-test="decisionHistory-loading-container">
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
