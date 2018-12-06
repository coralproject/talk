import React, { StatelessComponent } from "react";

import { Typography } from "talk-ui/components";

import Header from "./Header";

const Moderation: StatelessComponent = ({ children }) => (
  <div>
    <Header>Perspective Toxic Comment Filter</Header>
    <Typography>
      Using the Perspective API, the Toxic Comment filter warns users when
      comments exceed the predefined toxicity threshold. Toxic comments will not
      be published and are placed in the Pending Queue for review by a
      moderator. If approved by a moderator, the comment will be published.
    </Typography>
  </div>
);

export default Moderation;
