import React, { FunctionComponent } from "react";

import { InputDescription } from "coral-ui/components";
import { PropTypesOf } from "coral-ui/types";

import styles from "./ConfigDescription.css";

interface Props {
  container?: PropTypesOf<typeof InputDescription>["container"];
  children: React.ReactNode;
}

const ConfigDescription: FunctionComponent<Props> = ({
  children,
  container,
}) => (
  <InputDescription className={styles.description} container={container}>
    {children}
  </InputDescription>
);

export default ConfigDescription;
