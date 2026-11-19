import typeaheadScriptURL from "actor-typeahead/actor-typeahead.js";
import React, { FunctionComponent, ReactNode, useEffect, useRef } from "react";

import { useCoralContext } from "coral-framework/lib/bootstrap";

import styles from "./AtprotoHandleTypeahead.css";

let scriptLoading: Promise<void> | null = null;

/**
 * loadTypeahead adds the actor-typeahead script to the page once. It registers
 * the <actor-typeahead> element. Browsers that can't run it keep a plain input.
 */
function loadTypeahead(window: Window) {
  if (!scriptLoading) {
    scriptLoading = new Promise((resolve, reject) => {
      const script = window.document.createElement("script");
      script.type = "module";
      script.src = typeaheadScriptURL;
      script.onload = () => resolve();
      script.onerror = () => {
        // Allow a later form to try again.
        scriptLoading = null;
        reject(new Error("could not load actor-typeahead"));
      };
      window.document.head.appendChild(script);
    });
  }

  return scriptLoading;
}

interface Props {
  /**
   * host serves app.bsky.actor.searchActorsTypeahead. When it's empty, the
   * input is shown without suggestions.
   */
  host?: string | null;

  /** value is the input's current value in the form. */
  value: string;

  /** onChange is called with a handle the user picked from the suggestions. */
  onChange: (handle: string) => void;

  /** onSubmit submits the form, when Enter is pressed without picking one. */
  onSubmit: () => void;

  /** children is the <input> to suggest handles for. */
  children: ReactNode;
}

/**
 * AtprotoHandleTypeahead suggests handles while the user types one, with the
 * actor-typeahead element.
 *
 * The element sets the input's value directly when a suggestion is picked,
 * without an input event, so this passes the picked handle to the form as it's
 * set. It also cancels Enter even when no suggestion is picked, so then this
 * submits the form instead.
 */
const AtprotoHandleTypeahead: FunctionComponent<Props> = ({
  host,
  value,
  onChange,
  onSubmit,
  children,
}) => {
  const { window } = useCoralContext();
  const ref = useRef<HTMLElement>(null);

  // Keep the latest props readable from the event listeners.
  const latest = useRef({ value, onChange, onSubmit });
  latest.current = { value, onChange, onSubmit };

  useEffect(() => {
    if (host) {
      loadTypeahead(window).catch(() => {
        // Without the script the input works as a plain input.
      });
    }
  }, [host, window]);

  useEffect(() => {
    const element = ref.current;
    const input = element?.querySelector("input");
    if (!host || !element || !input) {
      return;
    }

    // Whether a suggestion was picked while the current event is handled.
    let picked = false;

    // The element puts a picked handle in the input by setting its value. The
    // form has to get it right away: setting the value doesn't tell React, and
    // React re-renders the input with the form's value in the same event (the
    // element focuses the input first), which would replace the handle. So
    // this input's value setter is wrapped to pass on what the element sets.
    // React sets the value through it too, with the form's own value, which is
    // ignored.
    const own = Object.getOwnPropertyDescriptor(input, "value");
    const descriptor =
      own ??
      Object.getOwnPropertyDescriptor(
        Object.getPrototypeOf(input) as object,
        "value"
      );
    if (!descriptor?.get || !descriptor.set) {
      return;
    }
    const { get, set } = descriptor;

    Object.defineProperty(input, "value", {
      configurable: true,
      enumerable: descriptor.enumerable,
      get() {
        return get.call(this);
      },
      set(next: string) {
        set.call(this, next);
        if (next !== latest.current.value) {
          picked = true;
          window.setTimeout(() => {
            picked = false;
          }, 0);
          latest.current.onChange(next);
        }
      },
    });

    // The element cancels Enter whether or not it picks a suggestion. When it
    // didn't pick one, submit the form as Enter would have. This listens on
    // the element, after its own listener, so a pick has happened by then.
    const onKeyDown = (evt: KeyboardEvent) => {
      // When the element isn't running (its script didn't load), Enter isn't
      // cancelled and submits the form as usual.
      if (evt.key !== "Enter" || !evt.defaultPrevented || picked) {
        return;
      }

      latest.current.onSubmit();
    };

    element.addEventListener("keydown", onKeyDown);

    return () => {
      element.removeEventListener("keydown", onKeyDown);
      if (own) {
        Object.defineProperty(input, "value", own);
      } else {
        delete (input as { value?: string }).value;
      }
    };
  }, [host, window]);

  if (!host) {
    return <>{children}</>;
  }

  return (
    <actor-typeahead ref={ref} host={host} rows="5" className={styles.root}>
      {children}
    </actor-typeahead>
  );
};

export default AtprotoHandleTypeahead;
