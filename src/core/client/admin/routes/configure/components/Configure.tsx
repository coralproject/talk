import React, { StatelessComponent } from "react";
import { HorizontalGutter, Typography } from "talk-ui/components";

const Configure: StatelessComponent = ({ children }) => (
  <HorizontalGutter>
    <Typography variant="heading3">Configure</Typography>
  </HorizontalGutter>
);

export default Configure;
