import cn from "classnames";
import * as React from "react";
import { ReactNode, StatelessComponent } from "react";

import { withStyles } from "talk-ui/hocs";
import { PropTypesOf } from "talk-ui/types";

import * as styles from "./Center.css";

interface InnerProps {
  /**
   * This prop can be used to add custom classnames.
   * It is handled by the `withStyles `HOC.
   */
  classes: Partial<typeof styles>;
  className?: string;
  children: ReactNode;
}

const Center: StatelessComponent<InnerProps> = props => {
  return (
    <div className={cn(props.className, props.classes.root)}>
      {props.children}
    </div>
  );
};

const enhanced = withStyles(styles)(Center);
export type CenterProps = PropTypesOf<typeof enhanced>;
export default enhanced;
