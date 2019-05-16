import { HorizontalGutter, Typography } from "coral-ui/components";
import React, { FunctionComponent } from "react";

const NotFound: FunctionComponent = ({ children }) => (
  <HorizontalGutter>
    <Typography variant="heading3">Not Found</Typography>
  </HorizontalGutter>
);

export default NotFound;
