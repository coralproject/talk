import React, { StatelessComponent } from "react";
import { HorizontalGutter, Typography } from "talk-ui/components";

const Stories: StatelessComponent = ({ children }) => (
  <HorizontalGutter>
    <Typography variant="heading3">Stories</Typography>
  </HorizontalGutter>
);

export default Stories;
