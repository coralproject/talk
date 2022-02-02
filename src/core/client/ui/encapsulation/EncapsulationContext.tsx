import { createContext, useContext } from "react";
import DefaultReactShadow from "react-shadow";

import CSSAsset from "./CSSAsset";

export interface EncapsulationContextProps {
  /** ReactShadowRoot prop allows you to pass a different instance of `react-shadow` */
  ReactShadowRoot?: typeof DefaultReactShadow;
  /** containerClassName is applied to the container inside of the shadow dom */
  containerClassName?: string;
  /** CSS assets to be added */
  cssAssets?: CSSAsset[];
  /** CSS assets to be added at the end */
  customCSSAssets?: CSSAsset[];
  /** Fonts CSS assets to be added to the light dom */
  fontsCSSAssets?: CSSAsset[];
  /**
   * Apply styling to the container. One usecase is to hide the container before CSS
   * is loaded to avoid unstyled content
   */
  style?: React.CSSProperties;
}

const EncapsulationContext = createContext<EncapsulationContextProps>({});

export function useEncapsulationContext() {
  return useContext(EncapsulationContext);
}

export default EncapsulationContext;
