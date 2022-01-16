import cn from "classnames";
import React, { FunctionComponent } from "react";
import DefaultReactShadow from "react-shadow";

import useShadowRootBreakpointClasses from "./useShadowRootBreakpointClasses";

export interface CSSAsset {
  href: string;
  onLoad?: () => void;
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
  style?: React.CSSProperties;
}

/**
 * Div with applied breakpoint classNames.
 */
const DivWithBreakpointClasses: FunctionComponent<React.HTMLAttributes<
  HTMLDivElement
>> = (props) => {
  const className = useShadowRootBreakpointClasses();
  return <div {...props} className={cn(props.className, className)} />;
};

const ReactShadowRoot: FunctionComponent<Props> = (props) => {
  const ReactShadow = props.Root || DefaultReactShadow;
  const cssAssets = props.cssAssets || [];
  const customCSSAssets = props.customCSSAssets || [];
  return (
    <ReactShadow.div>
      <DivWithBreakpointClasses
        id="coral"
        className={props.containerClassName}
        style={props.style}
      >
        {cssAssets.map((asset) => (
          <link
            key={asset.href}
            href={asset.href}
            onLoad={asset.onLoad}
            rel="stylesheet"
          />
        ))}
        {customCSSAssets.map((asset) => (
          <link
            key={asset.href}
            href={asset.href}
            onLoad={asset.onLoad}
            rel="stylesheet"
          />
        ))}
        {props.children}
      </DivWithBreakpointClasses>
    </ReactShadow.div>
  );
};

export default ReactShadowRoot;
