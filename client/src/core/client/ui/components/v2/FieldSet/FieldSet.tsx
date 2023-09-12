import cn from "classnames";
import React, { AllHTMLAttributes, FunctionComponent, Ref } from "react";

import { withForwardRef, withStyles } from "coral-ui/hocs";
import { PropTypesOf } from "coral-ui/types";

import styles from "./FieldSet.css";

interface InnerProps extends AllHTMLAttributes<HTMLElement> {
  /**
   * This prop can be used to add custom classnames.
   * It is handled by the `withStyles `HOC.
   */
  classes: typeof styles;
  /** Internal: Forwarded Ref */
  forwardRef?: Ref<HTMLFieldSetElement>;
}

const FieldSet: FunctionComponent<InnerProps> = (props) => {
  const { className, classes, forwardRef: ref, ...rest } = props;
  const rootClassName = cn(classes.root, className);
  return <fieldset className={rootClassName} {...rest} ref={ref} />;
};
const enhanced = withForwardRef(withStyles(styles)(FieldSet));
export type FieldSetProps = PropTypesOf<typeof enhanced>;
export default enhanced;
