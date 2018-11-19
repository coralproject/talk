import cn from "classnames";
import React, { ChangeEvent, Component, EventHandler, FocusEvent } from "react";
import uuid from "uuid/v4";

import { withKeyboardFocus, withStyles } from "talk-ui/hocs";

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
  children: React.ReactNode;
  /**
   * Display a light text.
   */
  light?: boolean;

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
      ...rest
    } = this.props;

    const rootClassName = cn(classes.root, className);
    const finalID = this.props.id || this.state.randomID;

    return (
      <div className={rootClassName}>
        <input
          className={classes.input}
          type="checkbox"
          id={finalID}
          {...rest}
        />
        <label
          className={cn(classes.label, {
            [classes.labelLight]: light,
            [classes.focus]: keyboardFocus,
          })}
          htmlFor={finalID}
        >
          <span className={classes.labelSpan}>{children}</span>
        </label>
      </div>
    );
  }
}

const enhanced = withStyles(styles)(withKeyboardFocus(CheckBox));
export default enhanced;
