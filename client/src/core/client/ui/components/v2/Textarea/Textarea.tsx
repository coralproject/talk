import cn from "classnames";
import React, { FunctionComponent, TextareaHTMLAttributes } from "react";

import styles from "./Textarea.css";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  fullwidth?: boolean;
}

const Textarea: FunctionComponent<Props> = ({
  className,
  children,
  fullwidth,
  ...rest
}) => (
  <textarea
    {...rest}
    className={cn(
      styles.root,
      {
        [styles.fullwidth]: fullwidth,
      },
      className
    )}
  >
    {children}
  </textarea>
);

export default Textarea;
