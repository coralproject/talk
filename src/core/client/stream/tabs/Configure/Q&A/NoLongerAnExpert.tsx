import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { getAriaPoliteMacOSWorkaround } from "coral-framework/helpers";
import { useCoralContext } from "coral-framework/lib/bootstrap";

import styles from "./NoLongerAnExpert.css";

interface Props {
  username: string | null;
}

const NoLongerAnExpert: FunctionComponent<Props> = ({ username }) => {
  const { window } = useCoralContext();
  return (
    <div
      className={styles.root}
      aria-live={getAriaPoliteMacOSWorkaround(window)}
    >
      <span className={styles.username}>{username}</span>
      <Localized id="configure-experts-noLongerAnExpert">
        <span className={styles.body}>is no longer an expert</span>
      </Localized>
    </div>
  );
};

export default NoLongerAnExpert;
