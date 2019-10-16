import React, { FunctionComponent } from "react";

import { HorizontalGutter, Typography } from "coral-ui/components";

const NotFound: FunctionComponent = ({ children }) => (
  <HorizontalGutter>
    <Typography variant="heading3">Not Found</Typography>
  </HorizontalGutter>
);

export default NotFound;
