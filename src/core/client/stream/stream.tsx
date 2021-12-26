import { EventEmitter2 } from "eventemitter2";
/* eslint-disable no-restricted-globals */
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import ReactDOM from "react-dom";

import { StaticConfig } from "coral-common/config";
import { LanguageCode } from "coral-common/helpers/i18n/locales";
import { parseQuery } from "coral-common/utils";
import { RefreshAccessTokenCallback } from "coral-embed/Coral";
import { createManaged } from "coral-framework/lib/bootstrap";
import { RefreshAccessTokenPromise } from "coral-framework/lib/bootstrap/createManaged";

import AppContainer from "./App";
import { createInitLocalState } from "./local";
import localesData from "./locales";
import ShadowRoot from "./ShadowRoot";

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
    const [injectedLinkTags, setInjectedLinkTags] = useState<HTMLLinkElement[]>(
      []
    );
    // Set inject link tag method.
    injectLinkTag = (linkTag: HTMLLinkElement) => {
      setInjectedLinkTags([...injectedLinkTags, linkTag]);
    };

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
        {options.customFontsCSSURL && (
          <link
            href={options.customFontsCSSURL}
            onLoad={handleCSSLoad}
            rel="stylesheet"
          />
        )}
        <ShadowRoot.div>
          <ManagedCoralContextProvider>
            <div
              id="coral"
              className={options.containerClassName}
              style={isCSSLoaded ? undefined : hideStyle}
            >
              {options.cssAssets.map((asset) => (
                <link
                  key={asset}
                  href={asset}
                  onLoad={handleCSSLoad}
                  rel="stylesheet"
                />
              ))}
              {injectedLinkTags.map((linkTag) => (
                <link
                  key={linkTag.href}
                  href={linkTag.href}
                  rel={linkTag.rel}
                  onLoad={linkTag.onload as any}
                />
              ))}
              {options.customCSSURL && (
                <link
                  href={options.customCSSURL}
                  onLoad={handleCSSLoad}
                  rel="stylesheet"
                />
              )}
              <AppContainer />
            </div>
          </ManagedCoralContextProvider>
        </ShadowRoot.div>
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
