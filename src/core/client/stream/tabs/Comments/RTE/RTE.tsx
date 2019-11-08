import { Blockquote, Bold, CoralRTE, Italic } from "@coralproject/rte";
import cn from "classnames";
import { Localized as LocalizedOriginal } from "fluent-react/compat";
import React, { EventHandler, FocusEvent, FunctionComponent, Ref } from "react";

import CLASSES from "coral-stream/classes";
import { Icon } from "coral-ui/components";
import { PropTypesOf } from "coral-ui/types";

import styles from "./RTE.css";

// Use a special Localized version that forwards
// ref and passes the api prop to the children.
// This is currently required in order for the RTE
// to detect and setup the features.
const Localized = React.forwardRef<any, PropTypesOf<typeof LocalizedOriginal>>(
  function RTELocalized({ api, ...props }, ref) {
    return (
      <LocalizedOriginal {...props}>
        {React.cloneElement(
          React.Children.only(props.children as React.ReactElement),
          { api, ref }
        )}
      </LocalizedOriginal>
    );
  }
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

  /**
   * className for the content area.
   */
  contentClassName?: string;

  /**
   * className for the palceholder text.
   */
  placeholderClassName?: string;

  /**
   * className for the toolbar.
   */
  toolbarClassName?: string;
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
  onFocus?: EventHandler<FocusEvent>;
  onBlur?: EventHandler<FocusEvent>;

  disabled?: boolean;

  forwardRef?: Ref<CoralRTE>;
}

const features = [
  <Localized key="bold" id="comments-rte-bold" attrs={{ title: true }}>
    <Bold>
      <Icon size="md">format_bold</Icon>
    </Bold>
  </Localized>,
  <Localized key="italic" id="comments-rte-italic" attrs={{ title: true }}>
    <Italic>
      <Icon size="md">format_italic</Icon>
    </Italic>
  </Localized>,
  <Localized
    key="blockquote"
    id="comments-rte-blockquote"
    attrs={{ title: true }}
  >
    <Blockquote key="blockquote">
      <Icon size="md">format_quote</Icon>
    </Blockquote>
  </Localized>,
];

const RTE: FunctionComponent<RTEProps> = props => {
  const {
    className,
    fullWidth,
    value,
    inputId,
    placeholder,
    onChange,
    disabled,
    defaultValue,
    forwardRef,
    contentClassName,
    placeholderClassName,
    toolbarClassName,
    onFocus,
    onBlur,
    ...rest
  } = props;
  return (
    <div>
      <CoralRTE
        inputId={inputId}
        className={cn(CLASSES.rte, className)}
        contentClassName={cn(
          CLASSES.rte.content,
          contentClassName,
          styles.content
        )}
        placeholderClassName={cn(
          CLASSES.rte.placeholder,
          placeholderClassName,
          styles.placeholder
        )}
        toolbarClassName={cn(
          CLASSES.rte.toolbar,
          toolbarClassName,
          styles.toolbar
        )}
        onChange={onChange}
        value={value || defaultValue}
        disabled={disabled}
        placeholder={placeholder}
        features={features}
        ref={forwardRef}
        toolbarPosition="bottom"
        onBlur={onBlur}
        onFocus={onFocus}
        {...rest}
      />
    </div>
  );
};

export default RTE;
