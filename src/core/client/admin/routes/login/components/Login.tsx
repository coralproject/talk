import React, { StatelessComponent } from "react";
import { HorizontalGutter, Typography } from "talk-ui/components";

const Login: StatelessComponent = ({ children }) => (
  <HorizontalGutter>
    <Typography variant="heading3">Login</Typography>
  </HorizontalGutter>
);

export default Login;
