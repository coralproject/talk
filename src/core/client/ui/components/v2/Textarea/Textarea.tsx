import cn from "classnames";
import React, { FunctionComponent, TextareaHTMLAttributes } from "react";

import styles from "./Textarea.css";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

const Textarea: FunctionComponent<Props> = ({
  className,
  children,
  ...rest
}) => (
  <textarea {...rest} className={cn(styles.root, className)}>
    {children}
  </textarea>
);

export default Textarea;
