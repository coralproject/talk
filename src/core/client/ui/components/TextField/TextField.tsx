import cn from "classnames";
import React, { AllHTMLAttributes, ChangeEvent, EventHandler } from "react";

import { StatelessComponent } from "react";
import { withStyles } from "talk-ui/hocs";

import styles from "./TextField.css";

export interface TextFieldProps {
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

  autoComplete?: AllHTMLAttributes<HTMLInputElement>["autoComplete"];
  autoCorrect?: AllHTMLAttributes<HTMLInputElement>["autoCorrect"];
  autoCapitalize?: AllHTMLAttributes<HTMLInputElement>["autoCapitalize"];
  spellCheck?: AllHTMLAttributes<HTMLInputElement>["spellCheck"];

  textAlignCenter?: boolean;
  adornment?: React.ReactNode;

  variant?: "regular" | "seamlessAdornment";
}

const TextField: StatelessComponent<TextFieldProps> = props => {
  const {
    className,
    classes,
    color,
    fullWidth,
    value,
    placeholder,
    adornment,
    textAlignCenter,
    variant,
    ...rest
  } = props;

  const rootClassName = cn(
    classes.root,
    {
      [classes.fullWidth]: fullWidth,
    },
    className
  );

  const inputClassName = cn(classes.input, {
    [classes.colorRegular]: color === "regular",
    [classes.colorError]: color === "error",
    [classes.textAlignCenter]: textAlignCenter,
    [classes.seamlessAdornment]: variant === "seamlessAdornment",
  });

  return (
    <div className={rootClassName}>
      <input
        className={inputClassName}
        placeholder={placeholder}
        value={value}
        {...rest}
      />
      {adornment && <div className={styles.adornment}>{adornment}</div>}
    </div>
  );
};

TextField.defaultProps = {
  color: "regular",
  placeholder: "",
  type: "text",
} as Partial<TextFieldProps>;

const enhanced = withStyles(styles)(TextField);
export default enhanced;
