import React, { StatelessComponent } from "react";
import { HorizontalGutter, Typography } from "talk-ui/components";

const Moderate: StatelessComponent = ({ children }) => (
  <HorizontalGutter>
    <Typography variant="heading3">Moderate</Typography>
  </HorizontalGutter>
);

export default Moderate;
