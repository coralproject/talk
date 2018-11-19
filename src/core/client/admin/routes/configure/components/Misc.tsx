import React, { StatelessComponent } from "react";

import { Typography } from "talk-ui/components";

import Header from "./Header";

const Misc: StatelessComponent = ({ children }) => (
  <div>
    <Header>Misc Integrations</Header>
    <Typography>Other stuff</Typography>
  </div>
);

export default Misc;
