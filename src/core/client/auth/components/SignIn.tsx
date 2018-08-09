import * as React from "react";
import { StatelessComponent } from "react";

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
    <Flex justifyContent="center">
      <Flex itemGutter direction="column">
        <Typography variant="heading1">
          Sign up to join the conversation
        </Typography>

        <FormField>
          <InputLabel>Email Address</InputLabel>
          <TextField fullWidth />
        </FormField>

        <FormField>
          <InputLabel>Username</InputLabel>
          <Typography>
            A unique identifier displayed on your comments. You may use “_” and
            “.”
          </Typography>
          <TextField fullWidth />
        </FormField>

        <FormField>
          <InputLabel>Password</InputLabel>
          <Typography>Must be at least 8 characters</Typography>
          <TextField fullWidth />
        </FormField>

        <FormField>
          <InputLabel>Confirm Password</InputLabel>
          <TextField fullWidth />
        </FormField>

        <Button variant="filled" color="primary" size="large" fullWidth>
          Sign up and join the conversation
        </Button>
      </Flex>
    </Flex>
  );
};

export default SignIn;
