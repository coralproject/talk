import cn from "classnames";
import React, { FunctionComponent } from "react";

import styles from "./FormFieldDescription.css";

interface Props {
  className?: string;
  children?: React.ReactNode;
}

const FormFieldDescription: FunctionComponent<Props> = ({
  children,
  className,
}) => {
  return <p className={cn(className, styles.root)}>{children}</p>;
};

export default FormFieldDescription;
