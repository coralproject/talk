import cn from "classnames";
import React, { FunctionComponent, LabelHTMLAttributes } from "react";

import styles from "./Label.css";

interface Props extends LabelHTMLAttributes<any> {
  className?: string;
  component?: "legend" | "p";
}

const Label: FunctionComponent<Props> = ({
  children,
  component,
  className,
  ...rest
}) => {
  const Component = component || "label";
  return (
    <Component {...rest} className={cn(styles.root, className)}>
      {children}
    </Component>
  );
};

export default Label;
