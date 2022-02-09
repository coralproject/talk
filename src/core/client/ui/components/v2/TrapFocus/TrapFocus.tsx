/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import React, {
  FunctionComponent,
  RefObject,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useUIContext } from "..";

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

export const TrapFocus: FunctionComponent<TrapFocusProps> = ({ children }) => {
  const { renderWindow } = useUIContext();
  const fallbackRef: React.RefObject<any> = React.createRef<any>();
  const firstFocusableRef: React.RefObject<any> = React.createRef<any>();
  const lastFocusableRef: React.RefObject<any> = React.createRef<any>();
  const [previousActiveElement] = useState<any>(
    renderWindow.document.activeElement
  );

  const focusBegin = useCallback(() => {
    (firstFocusableRef.current || fallbackRef.current).focus();
  }, [firstFocusableRef, fallbackRef]);
  const focusEnd = useCallback(() => {
    (lastFocusableRef.current || fallbackRef.current).focus();
  }, [lastFocusableRef, fallbackRef]);

  useEffect(() => {
    fallbackRef.current.focus();
    return () => {
      if (previousActiveElement && previousActiveElement.focus) {
        previousActiveElement.focus();
      }
    };
  }, [fallbackRef, previousActiveElement]);

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
