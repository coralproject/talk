/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import React, { FunctionComponent, RefObject, useEffect, useRef } from "react";

import { useUIContext } from "coral-ui/components/v2/UIContext";

interface RenderProps {
  firstFocusableRef: RefObject<any>;
  lastFocusableRef: RefObject<any>;
}

type RenderPropsCallback = (props: RenderProps) => React.ReactNode;

interface TrapFocusProps {
  children?: React.ReactNode | RenderPropsCallback;
}

function isRenderProp(
  children: TrapFocusProps["children"]
): children is RenderPropsCallback {
  return typeof children === "function";
}

const TrapFocus: FunctionComponent<TrapFocusProps> = ({ children }) => {
  const { renderWindow } = useUIContext();
  const fallbackRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLElement>(null);
  const lastFocusableRef = useRef<HTMLElement>(null);
  const previousActiveElement: any | null = renderWindow.document.activeElement;

  // Trap keyboard focus inside the dropdown until a value has been chosen.
  const focusBegin = () => {
    if (firstFocusableRef.current) {
      firstFocusableRef.current.focus();
    } else {
      if (fallbackRef.current) {
        fallbackRef.current.focus();
      }
    }
  };

  const focusEnd = () => {
    if (lastFocusableRef.current) {
      lastFocusableRef.current.focus();
    } else {
      if (fallbackRef.current) {
        fallbackRef.current.focus();
      }
    }
  };

  useEffect(() => {
    if (fallbackRef.current) {
      fallbackRef.current.focus();
    }
    return () => {
      if (previousActiveElement && previousActiveElement.focus) {
        previousActiveElement.focus();
      }
    };
  }, []);

  return (
    <>
      <div tabIndex={0} onFocus={focusEnd} />
      <div tabIndex={-1} ref={fallbackRef} />
      {isRenderProp(children)
        ? children({
            firstFocusableRef,
            lastFocusableRef,
          })
        : children}
      <div tabIndex={0} onFocus={focusBegin} />
    </>
  );
};

export default TrapFocus;
