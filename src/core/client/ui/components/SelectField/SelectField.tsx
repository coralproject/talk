import cn from "classnames";
import React, { ChangeEvent, EventHandler, FocusEvent } from "react";
import { StatelessComponent } from "react";

import { withKeyboardFocus, withStyles } from "talk-ui/hocs";
import Icon from "../Icon";

import styles from "./SelectField.css";

export interface SelectFieldProps {
  /**
   * Value that has been selected.
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

  /*
  * If set renders a full width button
  */
  fullWidth?: boolean;

  id?: string;
  autofocus?: boolean;
  name?: string;
  onChange?: EventHandler<ChangeEvent<HTMLSelectElement>>;
  disabled?: boolean;

  // These handlers are passed down by the `withKeyboardFocus` HOC.
  onFocus: EventHandler<FocusEvent<HTMLSelectElement>>;
  onBlur: EventHandler<FocusEvent<HTMLSelectElement>>;
  keyboardFocus: boolean;
}

const SelectField: StatelessComponent<SelectFieldProps> = props => {
  const {
    className,
    classes,
    fullWidth,
    keyboardFocus,
    children,
    disabled,
    ...rest
  } = props;

  const selectClassName = cn(classes.select, {
    [classes.fullWidth]: fullWidth,
    [classes.keyboardFocus]: keyboardFocus,
  });

  const iconWrapperClassName = cn(classes.iconWrapper, {
    [classes.iconWrapperDisabled]: disabled,
  });

  return (
    <span className={cn(classes.root, className)}>
      <select className={selectClassName} disabled={disabled} {...rest}>
        {children}
      </select>
      <span className={iconWrapperClassName} aria-hidden>
        <Icon>expand_more</Icon>
      </span>
    </span>
  );
};

const enhanced = withStyles(styles)(withKeyboardFocus(SelectField));
export default enhanced;
