import cn from "classnames";
import React, {
  ChangeEvent,
  EventHandler,
  FocusEvent,
  MouseEvent,
} from "react";
import { StatelessComponent } from "react";

import { withKeyboardFocus, withStyles } from "talk-ui/hocs";
import Icon from "../Icon";

import * as styles from "./SelectField.css";

export interface SelectFieldProps {
  id?: string;
  autofocus?: boolean;
  /**
   * Name
   */
  name?: string;
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

  onChange?: EventHandler<ChangeEvent<HTMLSelectElement>>;
  onFocus: EventHandler<FocusEvent<HTMLSelectElement>>;
  onBlur: EventHandler<FocusEvent<HTMLSelectElement>>;
  onMouseDown: EventHandler<MouseEvent<HTMLSelectElement>>;

  disabled?: boolean;
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
