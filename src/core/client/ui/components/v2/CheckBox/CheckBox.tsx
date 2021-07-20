import cn from "classnames";
import React, { ChangeEvent, Component, EventHandler, FocusEvent } from "react";
import { v4 as uuid } from "uuid";

import { withKeyboardFocus, withStyles } from "coral-ui/hocs";

import styles from "./CheckBox.css";

export interface CheckBoxProps {
  id?: string;
  /**
   * checked or not.
   */
  checked?: boolean;
  /**
   * Convenient prop to override the root styling.
   */
  className?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes: typeof styles;
  /**
   * Mark as readonly
   */
  readOnly?: boolean;
  /**
   * Name
   */
  name?: string;
  /**
   * onChange
   */
  onChange?: EventHandler<ChangeEvent<HTMLInputElement>>;

  disabled?: boolean;
  children?: React.ReactNode;
  /**
   * Display a light text.
   */
  light?: boolean;

  variant?: "default" | "streamBlue";

  // These handlers are passed down by the `withKeyboardFocus` HOC.
  onFocus: EventHandler<FocusEvent<HTMLElement>>;
  onBlur: EventHandler<FocusEvent<HTMLElement>>;
  keyboardFocus: boolean;
}

class CheckBox extends Component<CheckBoxProps> {
  public state = {
    randomID: uuid(),
  };
  public render() {
    const {
      className,
      classes,
      id,
      light,
      children,
      keyboardFocus,
      variant = "default",
      ...rest
    } = this.props;

    const rootClassName = cn(
      classes.root,
      {
        [classes.default]: variant === "default",
        [classes.streamBlue]: variant === "streamBlue",
      },
      className
    );
    const finalID = id || this.state.randomID;

    return (
      <div className={rootClassName}>
        <input
          className={cn(classes.input, {
            [classes.default]: variant === "default",
            [classes.streamBlue]: variant === "streamBlue",
          })}
          type="checkbox"
          id={finalID}
          {...rest}
        />
        <label
          className={cn(classes.label, {
            [classes.labelLight]: light,
            [classes.focus]: keyboardFocus,
            [classes.default]: variant === "default",
            [classes.streamBlue]: variant === "streamBlue",
          })}
          htmlFor={finalID}
        >
          <span className={cn(classes.labelSpan, "coral coral-checkbox-label")}>
            {children}
          </span>
        </label>
      </div>
    );
  }
}

const enhanced = withStyles(styles)(withKeyboardFocus(CheckBox));
export default enhanced;
