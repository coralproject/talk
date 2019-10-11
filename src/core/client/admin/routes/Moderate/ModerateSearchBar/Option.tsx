import cn from "classnames";
import React, { FunctionComponent, HTMLAttributes } from "react";

import styles from "./Option.css";

interface Props extends HTMLAttributes<HTMLLIElement> {
  href?: string;
  /** details contains additional information like the author */
  details?: React.ReactNode;
  /** children contains e.g. the title of the option */
  children?: React.ReactNode;
}

/**
 * Group represents a generic listbox option
 */
const Option: FunctionComponent<Props> = ({
  details,
  children,
  className,
  href,
  "aria-selected": selected,
  ...rest
}) => {
  const container = (
    <div className={styles.container}>
      <div
        className={cn(styles.title, {
          [styles.titleWithDetails]: Boolean(details),
        })}
      >
        {children}
      </div>
      <div className={styles.details}>{details}</div>
    </div>
  );

  return (
    <li
      role="option"
      className={cn(className, styles.root)}
      aria-selected={selected}
      {...rest}
    >
      {href && (
        <a href={href} className={styles.link} tabIndex={-1}>
          {container}
        </a>
      )}
      {!href && container}
    </li>
  );
};

export default Option;
