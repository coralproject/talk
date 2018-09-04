import { Blockquote, Bold, CoralRTE, Italic } from "@coralproject/rte";
import { Localized as LocalizedOriginal } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import { Icon } from "talk-ui/components";

import { PropTypesOf } from "talk-ui/types";
import * as styles from "./RTE.css";

// Use a special Localized version that forwards
// ref and passes the api prop to the children.
// This is currently required in order for the RTE
// to detect and setup the features.
const Localized = React.forwardRef<any, PropTypesOf<typeof LocalizedOriginal>>(
  ({ api, ...props }, ref) => (
    <LocalizedOriginal {...props}>
      {React.cloneElement(React.Children.only(props.children), { api, ref })}
    </LocalizedOriginal>
  )
);

export interface RTEProps {
  inputId?: string;
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
  /*
  * If set renders a full width button
  */
  fullWidth?: boolean;
  /**
   * Placeholder
   */
  placeholder?: string;
  /**
   * onChange
   */
  onChange?: (data: { html: string; text: string }) => void;

  disabled?: boolean;
}

// tslint:disable:jsx-wrap-multiline
const features = [
  <Localized key="bold" id="comments-rte-bold" attrs={{ title: true }}>
    <Bold>
      <Icon>format_bold</Icon>
    </Bold>
  </Localized>,
  <Localized key="italic" id="comments-rte-italic" attrs={{ title: true }}>
    <Italic>
      <Icon>format_italic</Icon>
    </Italic>
  </Localized>,
  <Localized
    key="blockquote"
    id="comments-rte-blockquote"
    attrs={{ title: true }}
  >
    <Blockquote key="blockquote">
      <Icon>format_quote</Icon>
    </Blockquote>
  </Localized>,
];
// tslint:enable:jsx-wrap-multiline

const RTE: StatelessComponent<RTEProps> = props => {
  const {
    className,
    fullWidth,
    value,
    inputId,
    placeholder,
    onChange,
    disabled,
    defaultValue,
    ...rest
  } = props;
  return (
    <div>
      <CoralRTE
        inputId={inputId}
        className={className}
        contentClassName={styles.content}
        placeholderClassName={styles.placeholder}
        onChange={onChange}
        value={value || defaultValue}
        disabled={disabled}
        placeholder={placeholder}
        features={features}
        {...rest}
      />
    </div>
  );
};

export default RTE;
