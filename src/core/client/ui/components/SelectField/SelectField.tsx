import cn from "classnames";
import React, {
  ChangeEvent,
  EventHandler,
  FocusEvent,
  FunctionComponent,
  MouseEvent,
} from "react";

import { withKeyboardFocus, withStyles } from "coral-ui/hocs";

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
  onClick?: EventHandler<MouseEvent>;
  disabled?: boolean;

  // These handlers are passed down by the `withKeyboardFocus` HOC.
  onFocus: EventHandler<FocusEvent<HTMLSelectElement>>;
  onBlur: EventHandler<FocusEvent<HTMLSelectElement>>;
  keyboardFocus: boolean;

  afterWrapper?: React.ReactElement<any>;
}

const SelectField: FunctionComponent<SelectFieldProps> = props => {
  const {
    className,
    classes,
    fullWidth,
    keyboardFocus,
    children,
    disabled,
    afterWrapper,
    ...rest
  } = props;

  const rootClassName = cn(classes.root, className, {
    [classes.fullWidth]: fullWidth,
  });

  const selectClassName = cn(classes.select, {
    [classes.keyboardFocus]: keyboardFocus,
  });

  const afterWrapperClassName = cn(classes.afterWrapper, {
    [classes.afterWrapperDisabled]: disabled,
  });

  return (
    <span className={rootClassName}>
      <select className={selectClassName} disabled={disabled} {...rest}>
        {children}
      </select>
      <span className={afterWrapperClassName} aria-hidden>
        {afterWrapper}
      </span>
    </span>
  );
};

SelectField.defaultProps = {
  afterWrapper: <Icon>expand_more</Icon>,
};

const enhanced = withStyles(styles)(withKeyboardFocus(SelectField));
export default enhanced;
