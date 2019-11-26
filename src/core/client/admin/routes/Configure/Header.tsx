import cn from "classnames";
import React, { FunctionComponent, ReactNode } from "react";

import styles from "./Header.css";

interface Props {
  children: ReactNode;
  className?: string;
  htmlFor?: string;
  container?: React.ReactElement<any> | React.ComponentType<any> | string;
}

const Header: FunctionComponent<Props> = ({
  children,
  container,
  className,
  ...rest
}) => {
  const Container = container!;
  if (React.isValidElement<any>(Container)) {
    return React.cloneElement(Container, {
      ...rest,
      className: cn(className, styles.root),
      children,
    });
  } else {
    return (
      <Container {...rest} className={cn(className, styles.root)}>
        {children}
      </Container>
    );
  }
};

Header.defaultProps = {
  container: <label />,
} as Partial<Props>;

export default Header;
