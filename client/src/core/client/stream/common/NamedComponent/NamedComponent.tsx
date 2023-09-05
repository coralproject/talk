import React, { FunctionComponent } from "react";

interface Props {
  id: string;
  children: React.ReactNode;
}

const NamedComponent: FunctionComponent<Props> = ({
  id: className,
  children,
}) => <div className={className}>{children}</div>;

export default NamedComponent;
