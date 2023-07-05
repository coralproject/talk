import cn from "classnames";
import React, {
  AllHTMLAttributes,
  ChangeEvent,
  EventHandler,
  FunctionComponent,
  KeyboardEvent,
  RefObject,
  useCallback,
  useState,
} from "react";

import Icon from "coral-ui/components/v2/Icon";
import { withForwardRef, withStyles } from "coral-ui/hocs";

import styles from "./PasswordField.css";

export interface PasswordFieldProps {
  id?: string;
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
   * Color of the PasswordField
   */
  color?: "regular" | "streamBlue" | "error";
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
   * onChange
   */
  onChange?: EventHandler<ChangeEvent<HTMLInputElement>>;

  disabled?: boolean;

  autoComplete?: AllHTMLAttributes<HTMLInputElement>["autoComplete"];
  autoCorrect?: AllHTMLAttributes<HTMLInputElement>["autoCorrect"];
  autoCapitalize?: AllHTMLAttributes<HTMLInputElement>["autoCapitalize"];
  spellCheck?: AllHTMLAttributes<HTMLInputElement>["spellCheck"];

  showPasswordTitle?: string;
  hidePasswordTitle?: string;

  forwardRef?: RefObject<HTMLInputElement>;
}

const PasswordField: FunctionComponent<PasswordFieldProps> = ({
  color = "regular",
  placeholder = "",
  showPasswordTitle = "Hide password",
  hidePasswordTitle = "Show password",
  autoCapitalize = "off",
  autoCorrect = "off",
  autoComplete = "off",
  spellCheck = false,
  className,
  classes,
  fullWidth,
  value,
  forwardRef,
  ...rest
}) => {
  const [reveal, setReveal] = useState(false);

  const toggleVisibility = useCallback(() => {
    setReveal((revealed) => !revealed);
  }, []);

  const handleVisibilityKeyUp = useCallback(
    (e: KeyboardEvent) => {
      // Number 13 is the "Enter" key on the keyboard
      if (e.keyCode === 13) {
        toggleVisibility();
      }
    },
    [toggleVisibility]
  );

  const rootClassName = cn(
    {
      [classes.fullWidth]: fullWidth,
    },
    classes.root,
    className
  );

  const inputClassName = cn(
    {
      [classes.colorRegular]: color === "regular",
      [classes.colorStreamBlue]: color === "streamBlue",
      [classes.colorError]: color === "error",
      [classes.fullWidth]: fullWidth,
    },
    classes.input
  );

  return (
    <div className={rootClassName}>
      <div className={classes.wrapper}>
        <input
          {...rest}
          className={inputClassName}
          placeholder={placeholder}
          value={value}
          type={reveal ? "text" : "password"}
          data-testid="password-field"
          ref={forwardRef}
        />
        <div
          role="button"
          className={styles.icon}
          title={reveal ? hidePasswordTitle : showPasswordTitle}
          onClick={toggleVisibility}
          onKeyUp={handleVisibilityKeyUp}
          tabIndex={0}
        >
          <Icon>{reveal ? "visibility_off" : "visibility"}</Icon>
        </div>
      </div>
    </div>
  );
};

const enhanced = withForwardRef(withStyles(styles)(PasswordField));
export default enhanced;
