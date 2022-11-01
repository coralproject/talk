import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import styles from "./Username.css";

interface Props {
  children: string | null;
  className?: string;
}

const Username: FunctionComponent<Props> = (props) => {
  return (
    <Localized
      id="username"
      attrs={{ "aria-label": true }}
      vars={{ username: props.children }}
    >
      <span className={cn(styles.root, props.className)}>{props.children}</span>
    </Localized>
  );
};

export default Username;
