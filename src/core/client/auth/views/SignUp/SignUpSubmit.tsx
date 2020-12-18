import { Localized } from "@fluent/react/compat";
import { useFormikContext } from "formik";
import React, { FunctionComponent } from "react";

import { Flex, Icon } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import styles from "./SignUpSubmit.css";

const SignUpSubmit: FunctionComponent = () => {
  const { isSubmitting } = useFormikContext();
  return (
    <div className={styles.actions}>
      <Button
        variant="filled"
        color="primary"
        fontSize="small"
        paddingSize="small"
        type="submit"
        disabled={isSubmitting}
        fullWidth
        upperCase
      >
        <Flex alignItems="center" justifyContent="center">
          <Icon size="md" className={styles.icon}>
            email
          </Icon>
          <Localized id="signUp-signUpWithEmail">
            <span>Sign up with Email</span>
          </Localized>
        </Flex>
      </Button>
    </div>
  );
};

export default SignUpSubmit;
