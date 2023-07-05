import React, { FunctionComponent } from "react";

import { Flex } from "coral-ui/components/v2";

import styles from "./Version.css";

const Version: FunctionComponent = () => {
  return (
    <Flex justifyContent="center" alignItems="center">
      <div className={styles.container}>
        {process.env.TALK_VERSION ? `v${process.env.TALK_VERSION}` : "Unknown"}
      </div>
    </Flex>
  );
};

export default Version;
