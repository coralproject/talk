import cn from "classnames";
import React, { InputHTMLAttributes, StatelessComponent } from "react";

import * as styles from "./Input.css";

interface InnerProps extends InputHTMLAttributes<HTMLInputElement> {
  classes?: typeof styles;
}

const Input: StatelessComponent<InnerProps> = ({ className, ...rest }) => {
  return <input {...rest} className={cn(styles.root, className)} />;
};

export default Input;
