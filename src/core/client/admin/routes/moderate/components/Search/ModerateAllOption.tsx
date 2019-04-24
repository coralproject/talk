import cn from "classnames";
import React, { FunctionComponent, HTMLAttributes } from "react";

import { Button, Icon } from "talk-ui/components";

import styles from "./ModerateAllOption.css";

interface Props extends HTMLAttributes<HTMLLIElement> {
  href?: string;
}

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
        <span>Moderate all stories</span>
        <span>
          <Icon className={styles.icon}>arrow_forward</Icon>
        </span>
      </Button>
    </li>
  );
};

export default ModerateAllOption;
