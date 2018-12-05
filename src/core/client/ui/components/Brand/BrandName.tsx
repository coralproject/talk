import cn from "classnames";
import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import { PropTypesOf } from "talk-framework/types";
import { Typography } from "talk-ui/components";
import { withStyles } from "talk-ui/hocs";

import styles from "./BrandName.css";

interface Props {
  align?: PropTypesOf<typeof Typography>["align"];
  className?: string;
  classes: typeof styles;
  size?: "md" | "lg";
}

const BrandName: StatelessComponent<Props> = ({
  align,
  className,
  classes,
  size,
  ...rest
}) => (
  <Localized id="general-brandName">
    <Typography
      {...rest}
      variant="heading1"
      align={align}
      className={cn(className, classes.root, {
        [classes.md]: size === "md",
        [classes.lg]: size === "lg",
      })}
    >
      Talk
    </Typography>
  </Localized>
);

BrandName.defaultProps = {
  size: "md",
  align: "left",
};

export default withStyles(styles)(BrandName);
