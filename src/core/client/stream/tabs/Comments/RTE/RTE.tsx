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
  useEffect,
  useMemo,
} from "react";

import { createSanitize } from "coral-common/helpers/sanitize";
import { useCoralContext } from "coral-framework/lib/bootstrap/CoralContext";
import IframeEncapsulation from "coral-framework/lib/encapsulation/IframeEncapsulation";
import CLASSES from "coral-stream/classes";
import { RTE_ELEMENT_ID } from "coral-stream/constants";
import { Icon } from "coral-ui/components/v2";
import { PropTypesOf } from "coral-ui/types";

import RTEButton from "./RTEButton";
import Sarcasm from "./Sarcasm";

import styles from "./RTE.css";

export const RTE_RESET_VALUE = "<div><br></div>";

interface RTEFeatures {
  bold?: boolean;
  italic?: boolean;
  blockquote?: boolean;
  strikethrough?: boolean;
  bulletList?: boolean;
  spoiler?: boolean;
  sarcasm?: boolean;
}

const createSanitizeToDOMFragment = (
  window: Window,
  features: RTEFeatures = {}
) => {
  /** Resused Sanitize instance */
  const sanitize = createSanitize(window, {
    features: {
      bold: features.bold,
      italic: features.italic,
      blockquote: features.blockquote,
      bulletList: features.bulletList,
      strikethrough: features.strikethrough,
      spoiler: features.spoiler,
      sarcasm: features.sarcasm,
    },
  });
  return (html: string) => {
    const frag = window.document.createDocumentFragment();
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
export const RTELocalized = React.forwardRef<
  any,
  PropTypesOf<typeof LocalizedOriginal>
>(function RTELocalized(
  { ctrlKey, squire, ButtonComponent, rteElementID, ...props },
  ref
) {
  return (
    <LocalizedOriginal {...props}>
      {React.cloneElement(
        React.Children.only(props.children as React.ReactElement),
        { ctrlKey, squire, ButtonComponent, rteElementID, ref }
      )}
    </LocalizedOriginal>
  );
});

export interface PasteEvent {
  fragment: DocumentFragment;
  preventDefault: () => void;
  defaultPrevented: boolean;
}

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
  onKeyPress?: React.KeyboardEventHandler;

  disabled?: boolean;

  forwardRef?: Ref<CoralRTE>;

  features?: RTEFeatures;

  toolbarButtons?: React.ReactElement | null;

  onWillPaste?: (event: PasteEvent) => void;

  /** onLoad is called when the RTE has been loaded */
  onLoad?: () => void;
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
    onWillPaste,
    onKeyPress,
    onLoad,
    ...rest
  } = props;

  const { window } = useCoralContext();
  const sanitizeToDOMFragment = useMemo(() => {
    return createSanitizeToDOMFragment(window, features);
  }, [features, window]);

  const featureElements = useMemo(() => {
    const x = [];
    if (features?.bold) {
      x.push(
        <RTELocalized key="bold" id="comments-rte-bold" attrs={{ title: true }}>
          <Bold>
            <Icon size="md">format_bold</Icon>
          </Bold>
        </RTELocalized>
      );
    }
    if (features?.italic) {
      x.push(
        <RTELocalized
          key="italic"
          id="comments-rte-italic"
          attrs={{ title: true }}
        >
          <Italic>
            <Icon size="md">format_italic</Icon>
          </Italic>
        </RTELocalized>
      );
    }
    if (features?.blockquote) {
      x.push(
        <RTELocalized
          key="blockquote"
          id="comments-rte-blockquote"
          attrs={{ title: true }}
        >
          <Blockquote>
            <Icon size="md">format_quote</Icon>
          </Blockquote>
        </RTELocalized>
      );
    }
    if (features?.bulletList) {
      x.push(
        <RTELocalized
          key="bulletedList"
          id="comments-rte-bulletedList"
          attrs={{ title: true }}
        >
          <UnorderedList>
            <Icon size="md">format_list_bulleted</Icon>
          </UnorderedList>
        </RTELocalized>
      );
    }
    if (features?.strikethrough) {
      x.push(
        <RTELocalized
          key="strikethrough"
          id="comments-rte-strikethrough"
          attrs={{ title: true }}
        >
          <Strike>
            <Icon size="md">strikethrough_s</Icon>
          </Strike>
        </RTELocalized>
      );
    }
    if (features?.spoiler) {
      x.push(
        <RTELocalized key="spoiler" id="comments-rte-spoiler">
          <Spoiler>Spoiler</Spoiler>
        </RTELocalized>
      );
    }
    if (features?.sarcasm) {
      x.push(
        <RTELocalized key="sarcasm" id="comments-rte-sarcasm">
          <Sarcasm>Sarcasm</Sarcasm>
        </RTELocalized>
      );
    }
    if (props.toolbarButtons) {
      x.push(props.toolbarButtons);
    }
    return x;
  }, [features, props.toolbarButtons]);

  const elementTree = (
    <div role="none">
      <CoralRTE
        inputID={inputID}
        rteElementID={RTE_ELEMENT_ID}
        className={cn(CLASSES.rte.$root, className)}
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
          styles.container,
          CLASSES.rte.container,
          containerClassName
        )}
        contentClassNameDisabled={styles.disabled}
        onChange={onChange}
        value={value || defaultValue || "<div><br></div>"}
        disabled={disabled}
        placeholder={placeholder}
        features={featureElements}
        ref={forwardRef}
        toolbarPosition="bottom"
        onBlur={onBlur}
        onFocus={onFocus}
        onWillPaste={onWillPaste}
        onKeyPress={onKeyPress}
        sanitizeToDOMFragment={sanitizeToDOMFragment}
        ButtonComponent={RTEButton}
        {...rest}
      />
    </div>
  );

  // Don't make things harder in test env.
  useEffect(() => {
    if (process.env.NODE_ENV === "test") {
      if (props.onLoad) {
        props.onLoad();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (process.env.NODE_ENV === "test") {
    return elementTree;
  }
  //

  return (
    <IframeEncapsulation onLoad={props.onLoad}>
      {elementTree}
    </IframeEncapsulation>
  );
};

export default RTE;
