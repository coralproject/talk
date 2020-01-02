import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, HTMLAttributes } from "react";

import { Button, Icon } from "coral-ui/components/v2";

import styles from "./ModerateAllOption.css";

interface Props extends HTMLAttributes<HTMLLIElement> {
  href?: string;
}

/**
 * ModerateAllOption is a listbox option that renders a moderate all button.
 */
const ModerateAllOption: FunctionComponent<Props> = ({
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
      <Button
        className={styles.button}
        href={href}
        color="dark"
        anchor
        fullWidth
        tabIndex={-1}
      >
        <Localized id="moderate-searchBar-moderateAllStories">
          <span>Moderate all stories</span>
        </Localized>
        <span>
          <Icon className={styles.icon} size="md">
            keyboard_arrow_right
          </Icon>
        </span>
      </Button>
    </li>
  );
};

export default ModerateAllOption;
