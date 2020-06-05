import cn from "classnames";
import React, {
  AllHTMLAttributes,
  ChangeEvent,
  Component,
  EventHandler,
  KeyboardEvent,
} from "react";

import { withStyles } from "coral-ui/hocs";

import Icon from "coral-ui/components/Icon";

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
  color?: "regular" | "streamError" | "error";
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
}

interface State {
  reveal: boolean;
}

class PasswordField extends Component<PasswordFieldProps, State> {
  public static defaultProps: Partial<PasswordFieldProps> = {
    color: "regular",
    placeholder: "",
    showPasswordTitle: "Hide password",
    hidePasswordTitle: "Show password",
    autoCapitalize: "off",
    autoCorrect: "off",
    autoComplete: "off",
    spellCheck: false,
  };

  public state = {
    reveal: false,
  };

  private handleVisibilityKeyUp = (e: KeyboardEvent) => {
    // Number 13 is the "Enter" key on the keyboard
    if (e.keyCode === 13) {
      this.toggleVisibility();
    }
  };

  private toggleVisibility = () => {
    this.setState((state) => ({
      reveal: !state.reveal,
    }));
  };

  public render() {
    const {
      className,
      classes,
      color,
      fullWidth,
      value,
      placeholder,
      hidePasswordTitle,
      showPasswordTitle,
      ...rest
    } = this.props;

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
        [classes.colorError]: color === "error",
        [classes.colorStreamError]: color === "streamError",
        [classes.fullWidth]: fullWidth,
      },
      classes.input
    );

    const reveal = this.state.reveal;

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
          />
          <div
            role="button"
            className={styles.icon}
            title={reveal ? hidePasswordTitle : showPasswordTitle}
            onClick={this.toggleVisibility}
            onKeyUp={this.handleVisibilityKeyUp}
            tabIndex={0}
          >
            <Icon>{reveal ? "visibility_off" : "visibility"}</Icon>
          </div>
        </div>
      </div>
    );
  }
}

const enhanced = withStyles(styles)(PasswordField);
export default enhanced;
