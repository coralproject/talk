import React, { FunctionComponent, ReactNode } from "react";

import Message from "../Message";
import MessageIcon from "../Message/MessageIcon";

export interface ValidationMessageProps {
  /**
   * The content of the component.
   */
  children: ReactNode;
  /**
   * Convenient prop to override the root styling.
   */
  className?: string;
  /**
   * If set renders a full width message
   */
  fullWidth?: boolean;
}

const ValidationMessage: FunctionComponent<ValidationMessageProps> = (
  props
) => {
  const { className, fullWidth, children, ...rest } = props;

  return (
    <Message
      color="error"
      className={className}
      fullWidth={fullWidth}
      {...rest}
    >
      <MessageIcon>warning</MessageIcon>
      {children}
    </Message>
  );
};

ValidationMessage.defaultProps = {
  fullWidth: false,
};

export default ValidationMessage;
