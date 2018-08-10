import * as React from "react";
import { StatelessComponent } from "react";
import * as styles from "./SignIn.css";

import {
  Button,
  Flex,
  FormField,
  InputLabel,
  TextField,
  Typography,
} from "talk-ui/components";

const SignIn: StatelessComponent = props => {
  return (
    <Flex itemGutter direction="column" className={styles.root}>
      <Typography variant="heading1" align="center">
        Sign in to join the conversation
      </Typography>
      <FormField>
        <InputLabel>Email Address</InputLabel>
        <TextField />
      </FormField>
      <FormField>
        <InputLabel>Password</InputLabel>
        <TextField />
        <span className={styles.forgotPassword}>
          <Button variant="underlined" color="primary" size="small">
            Forgot your password?
          </Button>
        </span>
      </FormField>
      <div className={styles.footer}>
        <Button variant="filled" color="primary" size="large" fullWidth>
          Sign in and join the conversation
        </Button>
        <Flex
          itemGutter="half"
          justifyContent="center"
          className={styles.subFooter}
        >
          <Typography>Don't have an account?</Typography>
          <Button variant="underlined" size="small" color="primary">
            Sign Up
          </Button>
        </Flex>
      </div>
    </Flex>
  );
};

export default SignIn;
