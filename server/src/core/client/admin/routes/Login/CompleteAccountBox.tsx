import React, { FunctionComponent } from "react";

import { Flex } from "coral-ui/components/v2";

import styles from "./CompleteAccountBox.css";

interface Props {
  title: React.ReactNode;
  children: React.ReactNode;
}

const CompleteAccountBox: FunctionComponent<Props> = ({
  title,
  children,
  ...rest
}) => {
  return (
    <div data-testid="completeAccountBox">
      <Flex justifyContent="center">
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.heading3}>
              Finish Setting Up Your Account
            </div>
            <div className={styles.title}>{title}</div>
          </div>
          <div className={styles.main}>
            <div {...rest}>{children}</div>
          </div>
        </div>
      </Flex>
    </div>
  );
};

export default CompleteAccountBox;
