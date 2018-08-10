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

const ResetPassword: StatelessComponent = props => {
  return (
    <Flex itemGutter direction="column" className={styles.root}>
      <Typography variant="heading1" align="center">
        Reset Password
      </Typography>
      <FormField>
        <InputLabel>Password</InputLabel>
        <Typography>Must be at least 8 characters</Typography>
        <TextField />
      </FormField>
      <FormField>
        <InputLabel>Confirm Password</InputLabel>
        <TextField />
      </FormField>
      <div className={styles.footer}>
        <Button variant="filled" color="primary" size="large" fullWidth>
          Reset Password
        </Button>
      </div>
    </Flex>
  );
};

export default ResetPassword;
