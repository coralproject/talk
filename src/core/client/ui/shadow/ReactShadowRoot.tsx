import cn from "classnames";
import React, {
  createContext,
  FunctionComponent,
  useContext,
  useMemo,
} from "react";
import DefaultReactShadow from "react-shadow";
import { useShadowRoot } from ".";

import useShadowRootBreakpointClasses from "./useShadowRootBreakpointClasses";
export interface CSSAsset {
  href: string;
  onLoad?: React.ReactEventHandler<HTMLLinkElement>;
}

interface Props {
  /** Root prop allows you to pass a different instance of `react-shadow` */
  Root?: typeof DefaultReactShadow;
  /** containerClassName is applied to the container inside of the shadow dom */
  containerClassName?: string;
  /** CSS assets to be added */
  cssAssets?: CSSAsset[];
  /** CSS assets to be added at the end */
  customCSSAssets?: CSSAsset[];
  /**
   * Apply styling to the container. One usecase is to hide the container before CSS
   * is loaded to avoid unstyled content
   */
  style?: React.CSSProperties;
}

/** Props for the `ReactShadowRootDerived` Component */
interface DerivedProps {
  /** If set, the `onLoad` on the CSS Assets will be called, you usually don't want that. */
  callOnLoad?: boolean;
  /**
   * Tell that this is used for a modal. Certain styles will be applied to
   * match this use case that are necessary to have correct breakpoints.
   * Defaults to true, as our main usecase for derived shadow doms are modals.
   */
  modal?: boolean;
}

const ShadowRootDerivedPropsContext = createContext<Props>({});

/**
 * Div with applied breakpoint classNames.
 */
const DivWithBreakpointClasses: FunctionComponent<React.HTMLAttributes<
  HTMLDivElement
>> = (props) => {
  const className = useShadowRootBreakpointClasses();
  return <div {...props} className={cn(props.className, className)} />;
};

/**
 * `ReactShadowRootDerived` allows you to have multiple shadow root containers.
 * In the React Tree it must be a descendant of the main `ReactShadowRoot` element and
 * it derives all props that are set on `ReactShadowRoot` essentially giving
 * you the same shadow dom environment with everything setup like CSS assets loading.
 */
export const ReactShadowRootDerived: FunctionComponent<DerivedProps> = (
  props
) => {
  const derivedProps = useContext(ShadowRootDerivedPropsContext);
  const ReactShadow = derivedProps.Root || DefaultReactShadow;
  const cssAssets = derivedProps.cssAssets || [];
  const customCSSAssets = derivedProps.customCSSAssets || [];
  const style = useMemo(
    () => ({
      display: "block",
      width: props.modal === false ? undefined : "100vw",
      ...derivedProps.style,
    }),
    [derivedProps.style, props.modal]
  );
  return (
    <ReactShadow.div>
      <DivWithBreakpointClasses
        id="coral"
        className={derivedProps.containerClassName}
        style={style}
      >
        {cssAssets.map((asset) => (
          <link
            key={asset.href}
            href={asset.href}
            onLoad={props.callOnLoad ? asset.onLoad : undefined}
            rel="stylesheet"
          />
        ))}
        {customCSSAssets.map((asset) => (
          <link
            key={asset.href}
            href={asset.href}
            onLoad={props.callOnLoad ? asset.onLoad : undefined}
            rel="stylesheet"
          />
        ))}
        {props.children}
      </DivWithBreakpointClasses>
    </ReactShadow.div>
  );
};

/**
 * Sets up the main shadow dom environment.
 */
const ReactShadowRoot: FunctionComponent<Props> = (props) => {
  const parentShadow = useShadowRoot();
  if (parentShadow) {
    throw new Error(
      "Unexpected Shadow Root in higher React Tree. Did you mean to used ReactShadowRootDerived instead?"
    );
  }
  return (
    <ShadowRootDerivedPropsContext.Provider value={props}>
      <ReactShadowRootDerived callOnLoad modal={false}>
        {props.children}
      </ReactShadowRootDerived>
    </ShadowRootDerivedPropsContext.Provider>
  );
};

export default ReactShadowRoot;
