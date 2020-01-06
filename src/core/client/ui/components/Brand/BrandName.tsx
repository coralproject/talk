import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import { Typography } from "coral-ui/components";
import { withStyles } from "coral-ui/hocs";

import styles from "./BrandName.css";

interface Props {
  align?: PropTypesOf<typeof Typography>["align"];
  className?: string;
  classes: typeof styles;
  size?: "md" | "lg";
}

const BrandName: FunctionComponent<Props> = ({
  align,
  className,
  classes,
  size,
  ...rest
}) => (
  <Localized id="ui-brandName">
    <Typography
      {...rest}
      variant="heading1"
      align={align}
      className={cn(className, classes.root, {
        [classes.md]: size === "md",
        [classes.lg]: size === "lg",
      })}
    >
      Coral
    </Typography>
  </Localized>
);

BrandName.defaultProps = {
  size: "md",
  align: "left",
};

export default withStyles(styles)(BrandName);
