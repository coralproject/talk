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

const ForgotPassword: StatelessComponent = props => {
  return (
    <Flex itemGutter direction="column" className={styles.root}>
      <Typography variant="heading1" align="center">
        Forgot Password
      </Typography>
      <Typography variant="bodyCopy" align="center">
        Enter your email address below and we will send you a link to reset your
        password.
      </Typography>
      <FormField>
        <InputLabel>Email Address</InputLabel>
        <TextField />
      </FormField>
      <div className={styles.footer}>
        <Button variant="filled" color="primary" size="large" fullWidth>
          Send Email
        </Button>
      </div>
    </Flex>
  );
};

export default ForgotPassword;
