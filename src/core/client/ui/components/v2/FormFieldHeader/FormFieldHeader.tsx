import cn from "classnames";
import React, { FunctionComponent, ReactNode } from "react";

import { withStyles } from "coral-ui/hocs";
import { Omit, PropTypesOf } from "coral-ui/types";

import HorizontalGutter from "coral-ui/components/HorizontalGutter";

import styles from "./FormFieldHeader.css";

interface Props extends Omit<PropTypesOf<typeof HorizontalGutter>, "ref"> {
  children: ReactNode;
  classes: typeof styles;
  className?: string;
}

const FormFieldHeader: FunctionComponent<Props> = props => {
  const { classes, className, children, ...rest } = props;

  return (
    <HorizontalGutter
      className={cn(classes.root, className)}
      spacing={1}
      {...rest}
    >
      {children}
    </HorizontalGutter>
  );
};

const enhanced = withStyles(styles)(FormFieldHeader);
export default enhanced;
