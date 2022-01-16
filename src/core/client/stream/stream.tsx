import { EventEmitter2 } from "eventemitter2";
/* eslint-disable no-restricted-globals */
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import ReactDOM from "react-dom";

import { StaticConfig } from "coral-common/config";
import { LanguageCode } from "coral-common/helpers/i18n/locales";
import { parseQuery } from "coral-common/utils";
import { RefreshAccessTokenCallback } from "coral-embed/Coral";
import { createManaged } from "coral-framework/lib/bootstrap";
import { RefreshAccessTokenPromise } from "coral-framework/lib/bootstrap/createManaged";
import ReactShadowRoot, { CSSAsset } from "coral-ui/shadow/ReactShadowRoot";

import AppContainer from "./App";
import { createInitLocalState } from "./local";
import localesData from "./locales";
import { EmotionShadowRoot } from "./shadow";

// Import css variables.
import "coral-ui/theme/streamEmbed.css";

export interface AttachOptions {
  locale?: LanguageCode;
  storyID?: string;
  storyURL?: string;
  storyMode?: string;
  commentID?: string;
  cssAssets: string[];
  accessToken?: string;
  version?: string;
  amp?: boolean;
  element: HTMLElement;
  refreshAccessToken?: RefreshAccessTokenCallback;
  graphQLSubscriptionURI?: string;
  rootURL: string;
  eventEmitter: EventEmitter2;
  staticConfig: StaticConfig;
  customCSSURL?: string;
  customFontsCSSURL?: string;
  disableDefaultFonts?: boolean;
  containerClassName?: string;
}

function extractBundleConfig() {
  const { storyID, storyURL } = parseQuery(location.search);
  return { storyID, storyURL } as Record<string, string>;
}

/** injectLinkTag is set by the Index Component  */
let injectLinkTag: (linkTag: HTMLLinkElement) => void;

// Style used to hide unstyled content (before css is loaded) but still lets browser
// render the tree.
const hideStyle: React.CSSProperties = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: "0",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: "0",
};

/**
 * Insert link tag is called by css loaders like style-loader or mini-css-extract plugin.
 * See webpack config.
 **/
export function insertLinkTag(linkTag: HTMLLinkElement) {
  // Inject link tag into Index Component
  injectLinkTag(linkTag);
}

/**
 * Create and attach CoralStream to Element.
 **/
export async function attach(options: AttachOptions) {
  // Detect and extract the storyID and storyURL from the current page so we can
  // add it to the managed provider.
  const bundleConfig = extractBundleConfig();

  let refreshAccessTokenPromise: RefreshAccessTokenPromise | undefined;
  if (options.refreshAccessToken) {
    refreshAccessTokenPromise = async () =>
      await new Promise((resolve) => options.refreshAccessToken!(resolve));
  }

  const ManagedCoralContextProvider = await createManaged({
    rootURL: options.rootURL,
    lang: options.locale,
    graphQLSubscriptionURI: options.graphQLSubscriptionURI,
    initLocalState: createInitLocalState(options),
    localesData,
    bundle: "stream",
    bundleConfig,
    eventEmitter: options.eventEmitter,
    refreshAccessTokenPromise,
  });

  // Amount of initial css files to be loaded.
  let initialCSSFileNumber = options.cssAssets.length;
  if (options.customCSSURL) {
    initialCSSFileNumber++;
  }
  if (options.customFontsCSSURL) {
    initialCSSFileNumber++;
  }
  if (!options.disableDefaultFonts) {
    initialCSSFileNumber++;
  }

  // Current amount of loaded css files.
  let cssLoaded = 0;

  const Index: FunctionComponent = () => {
    // Determine whether css has finished loading, before rendering the stream to prevent
    // flash of unstyled content.
    const [isCSSLoaded, setIsCSSLoaded] = useState(false);
    const handleCSSLoad = useCallback(() => {
      cssLoaded++;
      // When amount of css loaded equals initial css file number, mark as ready.
      if (cssLoaded === initialCSSFileNumber) {
        setIsCSSLoaded(true);
      }
    }, []);

    // CSS assets to be loaded inside of the shadow dom.
    const [shadowCSSAssets, setShadowCSSAssets] = useState<CSSAsset[]>(
      options.cssAssets.map((asset) => ({ href: asset, onLoad: handleCSSLoad }))
    );

    // CSS assets to be loaded inside of the shadow dom but after all other css assets.
    const customShadowCSSAssets: CSSAsset[] = useMemo(() => {
      if (options.customCSSURL) {
        return [
          {
            href: options.customCSSURL,
            onLoad: handleCSSLoad,
          },
        ];
      }
      return [];
    }, [handleCSSLoad]);

    // Set inject link tag method which is indirectly called by webpack.
    injectLinkTag = (linkTag: HTMLLinkElement) => {
      if (linkTag.rel !== "stylesheet") {
        throw new Error(
          `We currently don't support rel=${linkTag.rel}. This should not happen.`
        );
      }
      setShadowCSSAssets((assets) => [
        ...assets,
        { href: linkTag.href, onLoad: handleCSSLoad },
      ]);
    };

    useEffect(() => {
      if (options.disableDefaultFonts) {
        return;
      }
      // Import typography.
      /* @ts-ignore ignore missing typing error */
      void import("coral-ui/theme/typography.css").then(() => {
        handleCSSLoad();
      });
    }, [handleCSSLoad]);
    return (
      <>
        {// Fonts must be loaded outside of the shadow dom.
        options.customFontsCSSURL && (
          <link
            href={options.customFontsCSSURL}
            onLoad={handleCSSLoad}
            rel="stylesheet"
          />
        )}
        <ReactShadowRoot
          Root={EmotionShadowRoot}
          cssAssets={shadowCSSAssets}
          customCSSAssets={customShadowCSSAssets}
          containerClassName={options.containerClassName}
          style={isCSSLoaded ? undefined : hideStyle}
        >
          <ManagedCoralContextProvider>
            <AppContainer />
          </ManagedCoralContextProvider>
        </ReactShadowRoot>
      </>
    );
  };

  // eslint-disable-next-line no-restricted-globals
  ReactDOM.render(<Index />, options.element);
}

/**
 * Remove will unmount Coral Stream.
 **/
export async function remove(element: HTMLElement) {
  ReactDOM.unmountComponentAtNode(element);
}
