import React, { FunctionComponent } from "react";

import { BrandName, Flex, HorizontalGutter } from "coral-ui/components/v2";

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
          <div>
            <Flex justifyContent="center">
              <div className="adminSignInTitle">{title}</div>
            </Flex>
            <BrandName size="lg" align="center" />
          </div>
          {children}
        </HorizontalGutter>
      </Flex>
    </div>
  );
};

export default AuthBox;
