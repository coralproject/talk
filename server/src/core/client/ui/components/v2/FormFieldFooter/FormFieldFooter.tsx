import cn from "classnames";
import React, { FunctionComponent, ReactNode } from "react";

import { HorizontalGutter } from "coral-ui/components/v2";
import { withStyles } from "coral-ui/hocs";
import { PropTypesOf } from "coral-ui/types";

import styles from "./FormFieldFooter.css";

interface Props extends Omit<PropTypesOf<typeof HorizontalGutter>, "ref"> {
  children: ReactNode;
  classes: typeof styles;
  className?: string;
}

const FormFieldFooter: FunctionComponent<Props> = (props) => {
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

const enhanced = withStyles(styles)(FormFieldFooter);
export default enhanced;
