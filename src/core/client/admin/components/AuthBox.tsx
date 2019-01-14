import React, { StatelessComponent } from "react";

import {
  BrandIcon,
  BrandName,
  Flex,
  HorizontalGutter,
  Typography,
} from "talk-ui/components";

import styles from "./AuthBox.css";

interface Props {
  title: React.ReactNode;
  children: React.ReactNode;
}

const SignIn: StatelessComponent<Props> = ({ title, children }) => {
  return (
    <div>
      <Flex justifyContent="center">
        <HorizontalGutter className={styles.container} size="double">
          <Flex justifyContent="center">
            <div className={styles.brandIcon}>
              <BrandIcon size="lg" />
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

export default SignIn;
