import cn from "classnames";
import React, { ReactNode } from "react";
import { StatelessComponent } from "react";

import { withStyles } from "talk-ui/hocs";

import * as styles from "./FormField.css";

interface InnerProps {
  children: ReactNode;
  classes: typeof styles;
  id?: string;
  className?: string;
  itemGutter?: boolean | "half";
}

const FormField: StatelessComponent<InnerProps> = props => {
  const { classes, className, children, itemGutter, ...rest } = props;

  // TODO (bc): Use flex component once the extra div issue is solved.
  return (
    <div
      className={cn(
        classes.root,
        {
          [classes.itemGutter]: itemGutter === true,
          [classes.halfItemGutter]: itemGutter === "half",
        },
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

FormField.defaultProps = {
  itemGutter: true,
};

const enhanced = withStyles(styles)(FormField);
export default enhanced;
