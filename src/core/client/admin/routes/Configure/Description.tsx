import cn from "classnames";
import React, { FunctionComponent } from "react";

import styles from "./Description.css";

interface Props {
  className?: string;
}

const Description: FunctionComponent<Props> = ({ children, className }) => {
  return <p className={cn(className, styles.root)}>{children}</p>;
};

export default Description;
