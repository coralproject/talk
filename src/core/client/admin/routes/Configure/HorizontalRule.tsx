import cn from "classnames";
import React, { FunctionComponent } from "react";

import styles from "./HorizontalRule.css";

interface Props {
  className?: string;
  children?: any;
}

const HorizontalRule: FunctionComponent<Props> = ({ children, className }) => (
  <hr className={cn(styles.root, className)} />
);

export default HorizontalRule;
