import React, { FunctionComponent } from "react";

import {
  BrandMark,
  BrandName,
  Flex,
  HorizontalGutter,
  Typography,
} from "coral-ui/components";

import styles from "./AuthBox.css";

interface Props {
  title: React.ReactNode;
  children: React.ReactNode;
}

const AuthBox: FunctionComponent<Props> = ({ title, children }) => {
  return (
    <div data-testid="authBox">
      <Flex justifyContent="center">
        <HorizontalGutter className={styles.container} size="double">
          <Flex justifyContent="center">
            <div className={styles.brandIcon}>
              <BrandMark size="lg" />
            </div>
          </Flex>
          <div>
            <Typography align="center" variant="heading3">
              {title}
            </Typography>
            <BrandName size="lg" align="center" />
          </div>
          {children}
        </HorizontalGutter>
      </Flex>
    </div>
  );
};

export default AuthBox;
