import cn from "classnames";
import React from "react";
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
}

const TextField: StatelessComponent<TextFieldProps> = props => {
  const { className, classes, color, fullWidth, value, ...rest } = props;

  const rootClassName = cn(
    classes.root,
    {
      [classes.colorRegular]: color === "regular",
      [classes.colorError]: color === "error",
      [classes.fullWidth]: fullWidth,
    },
    className
  );

  return <input className={rootClassName} value={value} {...rest} />;
};

TextField.defaultProps = {
  color: "regular",
  fullWidth: false,
};

const enhanced = withStyles(styles)(TextField);
export default enhanced;
