import cn from "classnames";
import React, { FunctionComponent } from "react";

import styles from "./HorizontalRule.css";

interface Props {
  className?: string;
}

const HorizontalRule: FunctionComponent<Props> = ({ className }) => (
  <hr className={cn(styles.root, className)} />
);

export default HorizontalRule;
