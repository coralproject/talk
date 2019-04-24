import cn from "classnames";
import React, { FunctionComponent, HTMLAttributes } from "react";

import { Icon } from "talk-ui/components";

import styles from "./SeeAllOption.css";

interface Props extends HTMLAttributes<HTMLLIElement> {
  href?: string;
}

const SeeAllOption: FunctionComponent<Props> = ({
  className,
  href,
  ...rest
}) => {
  return (
    <li role="option" className={cn(className, styles.root)} {...rest}>
      <a className={styles.link} href={href || "#"} tabIndex={-1}>
        <span>See all results</span>
        <Icon className={styles.icon}>arrow_forward</Icon>
      </a>
    </li>
  );
};

export default SeeAllOption;
