import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";

import Main from "coral-auth/components/Main";
import useResizePopup from "coral-auth/hooks/useResizePopup";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { Button } from "coral-ui/components/v3";

import styles from "./CheckEmail.css";

interface Props {
  email: string;
}

const CheckEmail: FunctionComponent<Props> = ({ email }) => {
  const { window } = useCoralContext();
  const ref = useResizePopup();
  const closeWindow = useCallback(() => {
    window.close();
  }, [window]);
  const UserEmail = () => <span className={styles.strong}>{email}</span>;
  return (
    <div ref={ref} data-testid="forgotPassword-checkEmail-container">
      <div className={styles.bar}>
        <Localized id="forgotPassword-checkEmail-checkEmailHeader">
          <div className={styles.title}>Check Your Email</div>
        </Localized>
      </div>
      <Main data-testid="forgotPassword-checkEmail-main">
        <Localized
          id="forgotPassword-checkEmail-receiveEmail"
          elems={{ email: <UserEmail /> }}
        >
          <div className={styles.description}>
            {
              "If there is an account associated with <email></email>, you will receive an email with a link to create a new password."
            }
          </div>
        </Localized>
        <div className={styles.actions}>
          <Localized id="forgotPassword-checkEmail-closeButton">
            <Button
              variant="filled"
              color="primary"
              fontSize="medium"
              paddingSize="medium"
              upperCase
              fullWidth
              type="submit"
              onClick={closeWindow}
            >
              Close
            </Button>
          </Localized>
        </div>
      </Main>
    </div>
  );
};

export default CheckEmail;
