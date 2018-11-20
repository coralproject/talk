import React, { StatelessComponent } from "react";

import { InputDescription } from "talk-ui/components";
import { PropTypesOf } from "talk-ui/types";

interface Props {
  container?: PropTypesOf<typeof InputDescription>["container"];
  children: React.ReactNode;
}

import styles from "./ConfigDescription.css";

const ConfigDescription: StatelessComponent<Props> = ({
  children,
  container,
}) => (
  <InputDescription className={styles.description} container={container}>
    {children}
  </InputDescription>
);

export default ConfigDescription;
