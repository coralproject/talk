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

const SignUp: StatelessComponent = props => {
  return (
    <Flex itemGutter direction="column" className={styles.root}>
      <Typography variant="heading1" align="center">
        Sign up to join the conversation
      </Typography>

      <FormField>
        <InputLabel>Email Address</InputLabel>
        <TextField />
      </FormField>

      <FormField>
        <InputLabel>Username</InputLabel>
        <Typography>
          A unique identifier displayed on your comments. You may use “_” and
          “.”
        </Typography>
        <TextField />
      </FormField>

      <FormField>
        <InputLabel>Password</InputLabel>
        <Typography>Must be at least 8 characters</Typography>
        <TextField />
      </FormField>

      <FormField>
        <InputLabel>Confirm Password</InputLabel>
        <TextField />
      </FormField>

      <Button variant="filled" color="primary" size="large" fullWidth>
        Sign up and join the conversation
      </Button>
    </Flex>
  );
};

export default SignUp;
