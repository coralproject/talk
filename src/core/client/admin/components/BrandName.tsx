import cn from "classnames";
import React, { StatelessComponent } from "react";

import { PropTypesOf } from "talk-framework/types";
import { Typography } from "talk-ui/components";

import styles from "./BrandName.css";

interface Props {
  align?: PropTypesOf<typeof Typography>["align"];
  className?: string;
  size?: "md" | "lg";
}

const BrandName: StatelessComponent<Props> = props => (
  <Typography
    variant="heading1"
    align={props.align}
    className={cn(props.className, styles.root, {
      [styles.md]: props.size === "md",
      [styles.lg]: props.size === "lg",
    })}
  >
    Talk
  </Typography>
);

BrandName.defaultProps = {
  size: "md",
  align: "center",
};

export default BrandName;
