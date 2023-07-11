import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, HTMLAttributes } from "react";

import { ArrowRightIcon, SvgIcon } from "coral-ui/components/icons";

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
        <SvgIcon Icon={ArrowRightIcon} size="xs" className={styles.icon} />
      </a>
    </li>
  );
};

export default SeeAllOption;
