import cn from "classnames";
import React, { FunctionComponent, ReactNode } from "react";

import { PropTypesOf } from "coral-ui/types";

import Typography from "../Typography";

import styles from "./InputDescription.css";

interface InputDescriptionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  container?: PropTypesOf<typeof Typography>["container"];
}

const InputDescription: FunctionComponent<InputDescriptionProps> = (props) => {
  const { className, children, ...rest } = props;
  return (
    <div className={cn(className, styles.root)} {...rest}>
      {children}
    </div>
  );
};

export default InputDescription;
