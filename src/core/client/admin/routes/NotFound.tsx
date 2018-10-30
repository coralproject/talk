import React, { StatelessComponent } from "react";
import { HorizontalGutter, Typography } from "talk-ui/components";

const NotFound: StatelessComponent = ({ children }) => (
  <HorizontalGutter>
    <Typography variant="heading3">Not Found</Typography>
  </HorizontalGutter>
);

export default NotFound;
