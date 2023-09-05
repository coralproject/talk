import React, { FunctionComponent } from "react";

import styles from "./ButtonPadding.css";

interface ButtonPaddingProps {
  children?: React.ReactNode;
}

const ButtonPadding: FunctionComponent<ButtonPaddingProps> = (props) => (
  <div className={styles.root}>{props.children}</div>
);

export default ButtonPadding;
