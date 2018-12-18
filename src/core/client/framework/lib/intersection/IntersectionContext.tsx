import * as React from "react";

import { createContextHOC } from "talk-framework/helpers";
import ensurePolyfill from "./ensurePolyfill";

export type IntersectionCallback = (entry: IntersectionObserverEntry) => void;
export type Observe = (
  target: Element,
  callback: IntersectionCallback
) => () => void;
export interface IntersectionContext {
  observe: Observe;
}

const { Provider, Consumer } = React.createContext<IntersectionContext>(
  {} as any
);
export const IntersectionConsumer = Consumer;

export class IntersectionProvider extends React.Component<any, any> {
  private observer: IntersectionObserver;
  private elements = new Map();
  private elementBuffer: Element[] = [];
  private unmounted = false;

  public componentDidMount() {
    ensurePolyfill().then(() => {
      if (this.unmounted) {
        return;
      }
      this.observer = new IntersectionObserver(this.onIntersect, {
        root: this.props.node ? this.props.node : undefined,
        rootMargin: "0px",
        threshold: 0.25,
      });
      this.elementBuffer.forEach(element => this.observer.observe(element));
      this.elementBuffer = [];
    });
  }

  public componentWillUnmount() {
    this.unmounted = true;
  }

  private unobserve = (element: Element) => {
    this.elements.delete(element);
    if (!this.observer) {
      this.elementBuffer = this.elementBuffer.filter(e => e !== element);
    } else {
      this.observer.unobserve(element);
    }
  };

  private observe: Observe = (element, callback) => {
    this.elements.set(element, callback);
    // this funny bit to handle react's lifecycle order and also wait
    // for polyfill.
    if (!this.observer) {
      this.elementBuffer.push(element);
    } else {
      this.observer.observe(element);
    }
    return () => this.unobserve(element);
  };

  private onIntersect = (
    entries: IntersectionObserverEntry[],
    observer: IntersectionObserver
  ) => {
    entries.forEach(entry => this.elements.get(entry.target)(entry));
  };

  public render() {
    return (
      <Provider value={{ observe: this.observe }}>
        {this.props.children}
      </Provider>
    );
  }
}

export const withIntersectionContext = createContextHOC<IntersectionContext>(
  "withContext",
  IntersectionConsumer
);
