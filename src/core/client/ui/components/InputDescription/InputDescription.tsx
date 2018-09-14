import React, { ReactNode, StatelessComponent } from "react";
import { Typography } from "talk-ui/components";

interface InputDescriptionProps {
  children: ReactNode;
  id?: string;
  className?: string;
}

const InputDescription: StatelessComponent<InputDescriptionProps> = props => {
  const { className, children, ...rest } = props;
  return (
    <Typography
      variant="detail"
      color="textSecondary"
      className={className}
      {...rest}
    >
      {children}
    </Typography>
  );
};

export default InputDescription;
