import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";

import styles from "./OrSeparator.css";

const OrSeparator: FunctionComponent = () => (
  <Localized id="general-orSeparator">
    <div className={cn(CLASSES.login.orSeparator, styles.or)}>Or</div>
  </Localized>
);

export default OrSeparator;
