import {
  Blockquote,
  Bold,
  CoralRTE,
  Italic,
  Spoiler,
  Strike,
  UnorderedList,
} from "@coralproject/rte";
import { Localized as LocalizedOriginal } from "@fluent/react/compat";
import cn from "classnames";
import React, {
  EventHandler,
  FocusEvent,
  FunctionComponent,
  Ref,
  useMemo,
} from "react";

import { createSanitize } from "coral-common/helpers/sanitize";
import CLASSES from "coral-stream/classes";
import { Icon } from "coral-ui/components";
import { PropTypesOf } from "coral-ui/types";

import styles from "./RTE.css";

interface RTEFeatures {
  bold?: boolean;
  italic?: boolean;
  blockquote?: boolean;
  strikethrough?: boolean;
  bulletList?: boolean;
  spoiler?: boolean;
}

const createSanitizeToDOMFragment = (features: RTEFeatures = {}) => {
  /** Resused Sanitize instance */
  const sanitize = createSanitize(window, {
    features: {
      bold: features.bold,
      italic: features.italic,
      blockquote: features.blockquote,
      bulletList: features.bulletList,
      strikethrough: features.strikethrough,
      spoiler: features.spoiler,
    },
  });
  return (html: string) => {
    const frag = document.createDocumentFragment();
    if (html) {
      const sanitized = sanitize(html);
      while (sanitized.firstChild) {
        frag.appendChild(sanitized.firstChild);
      }
    }
    return frag;
  };
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

interface Props {
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
   * className for the container.
   */
  containerClassName?: string;

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

  features?: RTEFeatures;
}

const RTE: FunctionComponent<Props> = (props) => {
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
    containerClassName,
    contentClassName,
    placeholderClassName,
    toolbarClassName,
    onFocus,
    onBlur,
    features,
    ...rest
  } = props;

  const sanitizeToDOMFragment = useMemo(() => {
    return createSanitizeToDOMFragment(features);
  }, [features]);

  const featureElements = useMemo(() => {
    const x = [];
    if (features?.bold) {
      x.push(
        <Localized key="bold" id="comments-rte-bold" attrs={{ title: true }}>
          <Bold>
            <Icon size="md">format_bold</Icon>
          </Bold>
        </Localized>
      );
    }
    if (features?.italic) {
      x.push(
        <Localized
          key="italic"
          id="comments-rte-italic"
          attrs={{ title: true }}
        >
          <Italic>
            <Icon size="md">format_italic</Icon>
          </Italic>
        </Localized>
      );
    }
    if (features?.blockquote) {
      x.push(
        <Localized
          key="blockquote"
          id="comments-rte-blockquote"
          attrs={{ title: true }}
        >
          <Blockquote>
            <Icon size="md">format_quote</Icon>
          </Blockquote>
        </Localized>
      );
    }
    if (features?.bulletList) {
      x.push(
        <Localized
          key="bulletedList"
          id="comments-rte-bulletedList"
          attrs={{ title: true }}
        >
          <UnorderedList>
            <Icon size="md">format_list_bulleted</Icon>
          </UnorderedList>
        </Localized>
      );
    }
    if (features?.strikethrough) {
      x.push(
        <Localized
          key="strikethrough"
          id="comments-rte-strikethrough"
          attrs={{ title: true }}
        >
          <Strike>
            <Icon size="md">strikethrough_s</Icon>
          </Strike>
        </Localized>
      );
    }
    if (features?.spoiler) {
      x.push(
        <Localized key="spoiler" id="comments-rte-spoiler">
          <Spoiler>Spoiler</Spoiler>
        </Localized>
      );
    }
    return x;
  }, [features]);

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
          styles.toolbar,
          {
            [styles.toolbarHidden]: featureElements.length === 0,
          }
        )}
        contentContainerClassName={cn(
          CLASSES.rte.container,
          containerClassName
        )}
        onChange={onChange}
        value={value || defaultValue || "<div><br></div>"}
        disabled={disabled}
        placeholder={placeholder}
        features={featureElements}
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
