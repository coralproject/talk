import cn from "classnames";
import React, { ChangeEvent, EventHandler } from "react";
import { StatelessComponent } from "react";
import { withStyles } from "talk-ui/hocs";
import * as styles from "./TextField.css";

export interface TextFieldProps {
  /**
   * The content value of the component.
   */
  defaultValue?: string;
  /**
   * The content value of the component.
   */
  value?: string;
  /**
   * Convenient prop to override the root styling.
   */
  className?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes: typeof styles;
  /**
   * Color of the TextField
   */
  color?: "regular" | "error";
  /*
  * If set renders a full width button
  */
  fullWidth?: boolean;
  /**
   * Placeholder
   */
  placeholder?: string;
  /**
   * Mark as readonly
   */
  readOnly?: boolean;
  /**
   * Name
   */
  name?: string;
  /**
   * type: Here we only allow text type values
   */
  type?: "email" | "number" | "password" | "search" | "tel" | "text" | "url";
  /**
   * onChange
   */
  onChange?: EventHandler<ChangeEvent<HTMLInputElement>>;

  disabled?: boolean;
}

const TextField: StatelessComponent<TextFieldProps> = props => {
  const {
    className,
    classes,
    color,
    fullWidth,
    value,
    placeholder,
    ...rest
  } = props;

  const rootClassName = cn(
    classes.root,
    {
      [classes.colorRegular]: color === "regular",
      [classes.colorError]: color === "error",
      [classes.fullWidth]: fullWidth,
    },
    className
  );

  return (
    <input
      className={rootClassName}
      placeholder={placeholder}
      value={value}
      {...rest}
    />
  );
};

TextField.defaultProps = {
  color: "regular",
  placeholder: "",
  type: "text",
};

const enhanced = withStyles(styles)(TextField);
export default enhanced;
