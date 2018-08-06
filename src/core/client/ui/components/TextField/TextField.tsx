import cn from "classnames";
import React, { InputHTMLAttributes, StatelessComponent } from "react";

import * as styles from "./TextField.css";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  classes?: typeof styles;
}

const TextField: StatelessComponent<TextFieldProps> = ({
  className,
  ...rest
}) => {
  return <input {...rest} className={cn(styles.root, className)} />;
};

export default TextField;
