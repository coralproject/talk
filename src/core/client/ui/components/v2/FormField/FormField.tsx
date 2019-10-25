import cn from "classnames";
import React, { FunctionComponent, ReactNode } from "react";

import { withStyles } from "coral-ui/hocs";
import { Omit, PropTypesOf } from "coral-ui/types";

import HorizontalGutter from "coral-ui/components/HorizontalGutter";

import styles from "./FormField.css";

interface Props extends Omit<PropTypesOf<typeof HorizontalGutter>, "ref"> {
  children: ReactNode;
  classes: typeof styles;
  className?: string;
}

const FormField: FunctionComponent<Props> = props => {
  const { classes, className, children, ...rest } = props;

  return (
    <HorizontalGutter
      className={cn(classes.root, className)}
      spacing={2}
      {...rest}
    >
      {children}
    </HorizontalGutter>
  );
};

const enhanced = withStyles(styles)(FormField);
export default enhanced;
