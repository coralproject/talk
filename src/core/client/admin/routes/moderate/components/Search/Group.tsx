import cn from "classnames";
import React, { FunctionComponent } from "react";

import styles from "./Group.css";

interface Props {
  id: string;
  title: React.ReactNode;
  light?: boolean;
  children?: React.ReactNode;
}

/**
 * Group represents a ListBox Group
 */
const Group: FunctionComponent<Props> = ({ title, children, id, light }) => {
  return (
    <ul
      role="group"
      aria-labelledby={`${id}-title`}
      id={id}
      className={styles.root}
    >
      <li
        id={`${id}-title`}
        className={cn(styles.title, { [styles.light]: light })}
      >
        {title}
      </li>
      {children}
    </ul>
  );
};

export default Group;
