import cn from "classnames";
import React, { FunctionComponent, Ref } from "react";

import { withForwardRef } from "coral-ui/hocs";

import styles from "./Arrow.css";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  dark?: boolean;
  forwardRef?: Ref<HTMLDivElement>;
}

const Arrow: FunctionComponent<Props> = (props) => {
  const { className, dark, forwardRef: ref, ...rest } = props;
  return (
    <div
      {...rest}
      className={cn(className, styles.root, {
        [styles.colorDark]: dark,
      })}
      ref={ref}
    />
  );
};

export default withForwardRef(Arrow);
