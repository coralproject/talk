import React, { StatelessComponent } from "react";

import { Flex, Spinner } from "talk-ui/components";

import styles from "./DecisionHistoryLoading.css";
import Main from "./Main";
import Title from "./Title";

const DecisionHistoryLoading: StatelessComponent = props => (
  <div>
    <Title />
    <Main>
      <Flex
        justifyContent="center"
        alignItems="center"
        className={styles.container}
      >
        <Spinner size="sm" />
      </Flex>
    </Main>
  </div>
);

export default DecisionHistoryLoading;
