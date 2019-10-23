import cn from "classnames";
import React, { FunctionComponent, ReactNode } from "react";

import styles from "./Header.css";

interface Props {
  children: ReactNode;
  className?: string;
  htmlFor?: string;
  component?: "legend" | "label";
}

const Header: FunctionComponent<Props> = ({
  children,
  className,
  component,
  ...rest
}) => {
  const Container = component || (rest.htmlFor ? "label" : "h2");
  return (
    <Container {...rest} className={cn(className, styles.root)}>
      {children}
    </Container>
  );
};

export default Header;
