import React, { FunctionComponent, LabelHTMLAttributes } from "react";

import styles from "./Label.css";

interface Props extends LabelHTMLAttributes<any> {
  className?: string;
  component?: "legend" | "p";
}

const Label: FunctionComponent<Props> = ({ children, component, ...rest }) => {
  const Component = component || "label";
  return (
    <Component {...rest} className={styles.root}>
      {children}
    </Component>
  );
};

export default Label;
