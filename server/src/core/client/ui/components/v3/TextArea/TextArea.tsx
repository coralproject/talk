import cn from "classnames";
import React, {
  ChangeEvent,
  EventHandler,
  FunctionComponent,
  KeyboardEvent,
} from "react";

import { withStyles } from "coral-ui/hocs";

import styles from "./TextArea.css";

export interface TextAreaProps {
  name?: string;
  value?: string;
  placeholder?: string;
  color?: "regular" | "streamBlue" | "error";

  className?: string;
  classes: typeof styles;

  disabled?: boolean;

  onChange?: EventHandler<ChangeEvent<HTMLTextAreaElement>>;
  onKeyPress?: EventHandler<KeyboardEvent>;
  onKeyDown?: EventHandler<KeyboardEvent>;
}

const TextArea: FunctionComponent<TextAreaProps> = ({
  name,
  value,
  placeholder,
  color,
  className,
  classes,
  ...rest
}) => {
  const rootClassName = cn(classes.root, className);

  const inputClassName = cn(classes.input, {
    [classes.colorStreamBlue]: color === "streamBlue",
    [classes.colorRegular]: color === "regular",
    [classes.colorError]: color === "error",
  });

  return (
    <div className={rootClassName}>
      <textarea
        className={inputClassName}
        name={name}
        value={value}
        placeholder={placeholder}
        {...rest}
      ></textarea>
    </div>
  );
};

TextArea.defaultProps = {
  color: "regular",
  placeholder: "",
} as Partial<TextAreaProps>;

const enhanced = withStyles(styles)(TextArea);
export default enhanced;
