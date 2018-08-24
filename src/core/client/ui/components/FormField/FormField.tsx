import cn from "classnames";
import React, { HTMLAttributes, ReactNode } from "react";
import { StatelessComponent } from "react";

import { withStyles } from "talk-ui/hocs";

import Flex from "../Flex";
import * as styles from "./FormField.css";

interface InnerProps {
  children: ReactNode;
  classes: typeof styles;
  id?: string;
  className?: string;
}

const FormField: StatelessComponent<InnerProps> = props => {
  const { classes, className, children } = props;

  return (
    <Flex
      direction="column"
      className={cn(classes.root, className)}
      itemGutter="half"
    >
      {children}
    </Flex>
  );
};

FormField.defaultProps = {
  itemGutter: true,
};

const enhanced = withStyles(styles)(FormField);
export default enhanced;
