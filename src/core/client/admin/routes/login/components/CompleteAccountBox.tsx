import React, { FunctionComponent } from "react";

import { Flex, Typography } from "coral-ui/components";

import styles from "./CompleteAccountBox.css";

interface Props {
  title: React.ReactNode;
  children: React.ReactNode;
}

const CompleteAccountBox: FunctionComponent<Props> = ({ title, children }) => {
  return (
    <div data-testid="completeAccountBox">
      <Flex justifyContent="center">
        <div className={styles.container}>
          <div className={styles.header}>
            <Typography
              align="center"
              variant="heading3"
              color="textLight"
              className={styles.heading3}
            >
              Finish Setting Up Your Account
            </Typography>
            <Typography align="center" variant="heading1" color="textLight">
              {title}
            </Typography>
          </div>
          <div className={styles.main}>{children}</div>
        </div>
      </Flex>
    </div>
  );
};

export default CompleteAccountBox;
