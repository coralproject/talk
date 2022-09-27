import cn from "classnames";
import React, { FunctionComponent } from "react";

import styles from "./TextFieldAdornment.css";

interface Props {
  className?: string;
  children?: React.ReactNode;
}

const TextFieldAdornment: FunctionComponent<Props> = ({
  children,
  className,
}) => {
  return <span className={cn(className, styles.root)}>{children}</span>;
};

export default TextFieldAdornment;
