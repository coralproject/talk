import React, { useCallback, useEffect, useMemo, useRef } from "react";

export type IntersectionCallback = (entry: IntersectionObserverEntry) => void;

export type Observe = (
  target: Element,
  callback: IntersectionCallback
) => () => void;

export interface IntersectionContext {
  observe: Observe;
}

const IntersectionContext = React.createContext<IntersectionContext>({} as any);

export const useIntersectionContext = () =>
  React.useContext(IntersectionContext);

interface IntersectionProviderProps {
  children?: React.ReactNode;
}

export const IntersectionProvider: React.FunctionComponent<
  IntersectionProviderProps
> = ({ children }) => {
  const callbacks = useRef(new Map<Element, IntersectionCallback>());

  const onIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) =>
      entries.forEach((entry) => {
        const callback = callbacks.current.get(entry.target);
        if (!callback) {
          // This should prevent the edge case where the target was unobserved
          // but the event still fired.
          return;
        }

        callback(entry);
      }),
    []
  );

  // Create the observer that will last for the lifetime of the component.
  const observer = useMemo(
    () =>
      new IntersectionObserver(onIntersect, {
        rootMargin: "0px",
        threshold: 0.25,
      }),
    [onIntersect]
  );

  // When we unmount, disconnect the observer.
  useEffect(() => () => observer.disconnect(), [observer]);

  const observe: Observe = useCallback(
    (element, callback) => {
      const instance = callbacks.current;
      instance.set(element, callback);
      observer.observe(element);

      return () => {
        observer.unobserve(element);
        instance.delete(element);
      };
    },
    [observer]
  );

  return (
    <IntersectionContext.Provider value={{ observe }}>
      {children}
    </IntersectionContext.Provider>
  );
};
