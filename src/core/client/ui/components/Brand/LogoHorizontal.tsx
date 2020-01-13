import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { withStyles } from "coral-ui/hocs";
import logo2x from "./logo@2x.png";
import styles from "./LogoHorizontal.css";

interface Props {
  className?: string;
  classes: typeof styles;
  fill?: string;
}

const LogoHorizontal: FunctionComponent<Props> = ({
  className,
  classes,
  fill,
  ...rest
}) => (
  <>
    <Localized id="ui-brandName">
      <h1 aria-hidden className={styles.hiddenTitle}>
        Coral
      </h1>
    </Localized>
    <img className={styles.base} src={logo2x} alt="" />
  </>
);
LogoHorizontal.defaultProps = {
  fill: "#f77160",
};

export default withStyles(styles)(LogoHorizontal);
