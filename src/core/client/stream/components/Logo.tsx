import { Localized } from "fluent-react/compat";
import * as React from "react";
import { StatelessComponent } from "react";

import { Typography } from "talk-ui/components";

export interface LogoProps {
  className?: string;
  gutterBottom?: boolean;
}

const Logo: StatelessComponent<LogoProps> = props => {
  return (
    <Localized id="stream-logo">
      <Typography variant="heading1" gutterBottom={props.gutterBottom}>
        Talk NEO
      </Typography>
    </Localized>
  );
};

export default Logo;
