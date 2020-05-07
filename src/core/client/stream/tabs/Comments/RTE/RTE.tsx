import {
  Blockquote,
  Bold,
  CoralRTE,
  Italic,
  UnorderedList,
} from "@coralproject/rte";
import { Localized as LocalizedOriginal } from "@fluent/react/compat";
import cn from "classnames";
import { DOMPurifyI } from "dompurify";
import React, { EventHandler, FocusEvent, FunctionComponent, Ref } from "react";

import createPurify from "coral-common/helpers/createPurify";
import CLASSES from "coral-stream/classes";
import { Icon } from "coral-ui/components";
import { PropTypesOf } from "coral-ui/types";

import styles from "./RTE.css";

/** Resused DOMPurify instance */
let purify: DOMPurifyI | null = null;

/**
 * Return a purify instance that will be used to handle HTML content.
 */
function getPurifyInstance() {
  if (purify) {
    return purify;
  }
  purify = createPurify(window, {
    config: {
      ALLOW_UNKNOWN_PROTOCOLS: true,
      WHOLE_DOCUMENT: false,
      RETURN_DOM: false,
      RETURN_DOM_FRAGMENT: true,
    },
  });
  return purify;
}

/**
 * Sanitation callback that we pass to squire.
 */
const sanitizeToDOMFragment = (html: string) => {
  const frag = html
    ? getPurifyInstance().sanitize(html, {
        // TODO: Be aware, this has only affect on the return type. It does not affect the config.
        RETURN_DOM_FRAGMENT: true,
      })
    : document.createDocumentFragment();
  return frag;
};

// Use a special Localized version that forwards
// ref and passes the api prop to the children.
// This is currently required in order for the RTE
// to detect and setup the features.
const Localized = React.forwardRef<any, PropTypesOf<typeof LocalizedOriginal>>(
  function RTELocalized({ ctrlKey, squire, ...props }, ref) {
    return (
      <LocalizedOriginal {...props}>
        {React.cloneElement(
          React.Children.only(props.children as React.ReactElement),
          { ctrlKey, squire, ref }
        )}
      </LocalizedOriginal>
    );
  }
);

export interface RTEProps {
  inputID?: string;
  /**
   * The default content value of the component.
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
  onChange?: (html: string) => void;
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
    <Blockquote>
      <Icon size="md">format_quote</Icon>
    </Blockquote>
  </Localized>,
  <Localized
    key="bulletedList"
    id="comments-rte-bulletedList"
    attrs={{ title: true }}
  >
    <UnorderedList>
      <Icon size="md">format_list_bulleted</Icon>
    </UnorderedList>
  </Localized>,
];

const RTE: FunctionComponent<RTEProps> = (props) => {
  const {
    className,
    fullWidth,
    value,
    inputID,
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
        inputID={inputID}
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
        value={value || defaultValue || "<div><br></div>"}
        disabled={disabled}
        placeholder={placeholder}
        features={features}
        ref={forwardRef}
        toolbarPosition="bottom"
        onBlur={onBlur}
        onFocus={onFocus}
        sanitizeToDOMFragment={sanitizeToDOMFragment}
        {...rest}
      />
    </div>
  );
};

export default RTE;
