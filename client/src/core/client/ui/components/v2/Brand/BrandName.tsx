import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import { withStyles } from "coral-ui/hocs";

import styles from "./BrandName.css";

interface Props {
  align?: "inherit" | "left" | "center" | "right" | "justify";
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
    <div
      {...rest}
      className={cn(className, classes.root, {
        [classes.md]: size === "md",
        [classes.lg]: size === "lg",
        [classes.alignLeft]: align === "left",
        [classes.alignCenter]: align === "center",
        [classes.alignRight]: align === "right",
        [classes.alignJustify]: align === "justify",
      })}
    >
      Coral
    </div>
  </Localized>
);

BrandName.defaultProps = {
  size: "md",
  align: "left",
};

export default withStyles(styles)(BrandName);
