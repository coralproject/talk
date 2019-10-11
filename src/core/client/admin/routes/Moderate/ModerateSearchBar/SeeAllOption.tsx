import cn from "classnames";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, HTMLAttributes } from "react";

import { Icon } from "coral-ui/components";

import styles from "./SeeAllOption.css";

interface Props extends HTMLAttributes<HTMLLIElement> {
  href?: string;
}

/**
 * SeeAllOption is a listbox option that renders a see all search results button.
 */
const SeeAllOption: FunctionComponent<Props> = ({
  className,
  href,
  "aria-selected": selected,
  ...rest
}) => {
  return (
    <li
      role="option"
      className={cn(className, styles.root)}
      aria-selected={selected}
      {...rest}
    >
      <a className={styles.link} href={href || "#"} tabIndex={-1}>
        <Localized id="moderate-searchBar-seeAllResults">
          <span>See all results</span>
        </Localized>
        <Icon className={styles.icon}>arrow_forward</Icon>
      </a>
    </li>
  );
};

export default SeeAllOption;
