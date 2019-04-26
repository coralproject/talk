import cn from "classnames";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, HTMLAttributes } from "react";

import { Button, Icon } from "talk-ui/components";

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
  ...rest
}) => {
  return (
    <li role="option" className={cn(className, styles.root)} {...rest}>
      <Button
        href={href}
        color="primary"
        className={styles.link}
        anchor
        fullWidth
        tabIndex={-1}
      >
        <Localized id="moderate-searchBar-moderateAllStories">
          <span>Moderate all stories</span>
        </Localized>
        <span>
          <Icon className={styles.icon}>arrow_forward</Icon>
        </span>
      </Button>
    </li>
  );
};

export default ModerateAllOption;
