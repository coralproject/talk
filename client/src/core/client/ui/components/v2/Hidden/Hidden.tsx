import cn from "classnames";
import React, { FunctionComponent, HTMLAttributes } from "react";

import styles from "./Hidden.css";

interface Props extends HTMLAttributes<any> {
  /**
   * The container used for the root node.
   * Either a string to use a DOM element, a component, or an element.
   */
  container?: React.ReactElement<any> | React.ComponentType<any> | string;
}

const Hidden: FunctionComponent<Props> = ({
  children,
  container,
  className,
  ...rest
}) => {
  const innerProps = {
    className: cn(className, styles.root),
    ...rest,
  };
  const Container = container!;
  if (React.isValidElement<any>(Container)) {
    return React.cloneElement(Container, { ...innerProps, children });
  } else {
    return <Container {...innerProps}>{children}</Container>;
  }
};

Hidden.defaultProps = {
  container: "div",
};

export default Hidden;
