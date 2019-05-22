import cn from "classnames";
import React, { ReactNode } from "react";
import { FunctionComponent } from "react";

import { withStyles } from "coral-ui/hocs";
import { Omit, PropTypesOf } from "coral-ui/types";

import HorizontalGutter from "../HorizontalGutter";

import styles from "./FormField.css";

interface Props extends Omit<PropTypesOf<typeof HorizontalGutter>, "ref"> {
  children: ReactNode;
  classes: typeof styles;
  id?: string;
  className?: string;
}

const FormField: FunctionComponent<Props> = props => {
  const { classes, className, children, ...rest } = props;

  return (
    <HorizontalGutter
      className={cn(classes.root, className)}
      size="half"
      {...rest}
    >
      {children}
    </HorizontalGutter>
  );
};

const enhanced = withStyles(styles)(FormField);
export default enhanced;
