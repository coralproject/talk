import cn from "classnames";
import React, { FunctionComponent } from "react";

import styles from "./OptionDetail.css";

interface Props {
  variant?: "bold" | "muted";
  children?: React.ReactNode;
}

const OptionDetail: FunctionComponent<Props> = ({ children, variant }) => (
  <span
    className={cn({
      [styles.muted]: variant === "muted",
      [styles.bold]: variant === "bold",
    })}
  >
    {children}
  </span>
);

export default OptionDetail;
