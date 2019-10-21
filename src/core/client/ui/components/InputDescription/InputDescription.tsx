import React, { FunctionComponent, ReactNode } from "react";

import { Typography } from "coral-ui/components";
import { PropTypesOf } from "coral-ui/types";

interface InputDescriptionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  container?: PropTypesOf<typeof Typography>["container"];
}

const InputDescription: FunctionComponent<InputDescriptionProps> = props => {
  const { className, children, ...rest } = props;
  return (
    <Typography
      variant="fieldDescription"
      color="textSecondary"
      className={className}
      {...rest}
    >
      {children}
    </Typography>
  );
};

export default InputDescription;
