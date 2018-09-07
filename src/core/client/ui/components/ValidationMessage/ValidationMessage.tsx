import React, { ReactNode, StatelessComponent } from "react";
import Message from "../Message";

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
  /*
  * Name of the icon, if not provided it will default to warning icon
  */
  icon?: string;
}

const ValidationMessage: StatelessComponent<ValidationMessageProps> = props => {
  const { className, fullWidth, children, icon, ...rest } = props;

  return (
    <Message
      color="validation"
      icon={icon ? icon : "warning"}
      className={className}
      {...rest}
    >
      {children}
    </Message>
  );
};

ValidationMessage.defaultProps = {
  fullWidth: false,
};

export default ValidationMessage;
