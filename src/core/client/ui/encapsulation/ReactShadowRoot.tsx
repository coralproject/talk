import React, { FunctionComponent, useMemo } from "react";
import DefaultReactShadow from "react-shadow";

import CoralShadowRootContainer from "./CoralShadowRootContainer";
import CSSAsset from "./CSSAsset";
import { useEncapsulationContext } from "./EncapsulationContext";
import useShadowRoot from "./useShadowRoot";

interface Props {
  /**
   * Adjust Shadow DOM root to be used as a modal.
   *
   * Use case: The children of the Shadow DOM is a
   * container that is rendered either `position: absolute`
   * or `position: fixed` and it's width is set to `100%`.
   *
   * The shadow dom root is adjustet to have the same width,
   * so that breakpoint calculations work as expected.
   */
  modal?: boolean;

  /**
   * Load font assets into light dom.
   */
  loadFonts?: boolean;

  children?: React.ReactNode;
}

const emptyArray: CSSAsset[] = [];

/**
 * Sets up Shadow DOM encapsulation.
 */
const ReactShadowRoot: FunctionComponent<Props> = (props) => {
  const encapsulation = useEncapsulationContext();
  const parentShadow = useShadowRoot();
  if (parentShadow && props.loadFonts) {
    throw new Error(
      "Fonts can only be loaded by the outer most ReactShadowRoot"
    );
  }
  const ReactShadow = encapsulation.ReactShadowRoot || DefaultReactShadow;
  const assets = useMemo(
    () => [
      ...(encapsulation.cssAssets || emptyArray),
      ...(encapsulation.customCSSAssets || emptyArray),
    ],
    [encapsulation.cssAssets, encapsulation.customCSSAssets]
  );

  const style = useMemo(
    () => ({
      display: "block",
      width: !props.modal ? undefined : "100vw",
      ...encapsulation.style,
    }),
    [encapsulation.style, props.modal]
  );

  return (
    <>
      {props.loadFonts &&
        encapsulation.fontsCSSAssets &&
        // CSS with font definitions must be loaded in the light dom.
        encapsulation.fontsCSSAssets.map((asset) => (
          <link
            key={asset.href}
            href={asset.href}
            onLoad={asset.onLoad}
            onError={asset.onError}
            rel="stylesheet"
          />
        ))}
      <ReactShadow.div>
        <CoralShadowRootContainer
          className={encapsulation.containerClassName}
          style={style}
        >
          {assets.map((asset) => (
            <link
              key={asset.href}
              href={asset.href}
              onLoad={asset.onLoad}
              onError={asset.onError}
              rel="stylesheet"
            />
          ))}
          {props.children}
        </CoralShadowRootContainer>
      </ReactShadow.div>
    </>
  );
};

export default ReactShadowRoot;
