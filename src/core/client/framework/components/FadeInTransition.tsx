import React, { FunctionComponent } from "react";
import { CSSTransition } from "react-transition-group";

import styles from "./FadeInTransition.css";

interface Props {
  active: boolean;
  children: React.ReactNode;
}

const FadeInTransition: FunctionComponent<Props> = ({ children, active }) => {
  if (!active) {
    return <>{children}</>;
  }
  return (
    <CSSTransition
      in
      appear
      enter={false}
      exit={false}
      classNames={{
        appear: styles.appear,
        appearActive: styles.appearActive,
      }}
      timeout={600}
    >
      <div>{children}</div>
    </CSSTransition>
  );
};
export default FadeInTransition;
