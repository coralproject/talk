import cn from "classnames";
import React, { ChangeEvent, Component, EventHandler, FocusEvent } from "react";
import { v4 as uuid } from "uuid";

import { Flex } from "coral-ui/components/v2";
import { withKeyboardFocus, withStyles } from "coral-ui/hocs";

import styles from "./RadioButton.css";

export interface RadioButtonProps {
  id?: string;
  /**
   * The content value of the component.
   */
  value?: string;

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

export class RadioButton extends Component<RadioButtonProps> {
  public state = {
    randomID: uuid(),
  };
  public render() {
    const { className, classes, id, light, children, keyboardFocus, ...rest } =
      this.props;

    const rootClassName = cn(classes.root, className);
    const finalID = id || this.state.randomID;

    return (
      <Flex alignItems="center" className={rootClassName}>
        <input className={classes.input} type="radio" id={finalID} {...rest} />
        <label
          className={cn(classes.label, {
            [classes.labelLight]: light,
            [classes.focus]: keyboardFocus,
            [classes.labelChecked]: this.props.checked,
          })}
          htmlFor={finalID}
        >
          {children}
        </label>
      </Flex>
    );
  }
}

const enhanced = withStyles(styles)(withKeyboardFocus(RadioButton));
export default enhanced;
