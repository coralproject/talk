import { EventEmitter2 } from "eventemitter2";
/* eslint-disable no-restricted-globals */
import React, { FunctionComponent, useState } from "react";
import ReactDOM from "react-dom";

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
import "coral-ui/theme/typography.css";

interface Options {
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
}

function extractBundleConfig() {
  const { storyID, storyURL } = parseQuery(location.search);
  return { storyID, storyURL } as Record<string, string>;
}

/** injectLinkTag is set by the Index Component  */
let injectLinkTag: (linkTag: HTMLLinkElement) => void;

export function insertLinkTag(linkTag: HTMLLinkElement) {
  // Inject link tag into Index Component
  injectLinkTag(linkTag);
}

export async function attach(options: Options) {
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
    graphQLSubscriptionURI: options.graphQLSubscriptionURI,
    initLocalState: createInitLocalState(options),
    localesData,
    bundle: "stream",
    bundleConfig,
    eventEmitter: options.eventEmitter,
    refreshAccessTokenPromise,
  });

  const Index: FunctionComponent = () => {
    const [injectedLinkTags, setInjectedLinkTags] = useState<HTMLLinkElement[]>(
      []
    );
    // Set inject link tag method.
    injectLinkTag = (linkTag: HTMLLinkElement) => {
      setInjectedLinkTags([...injectedLinkTags, linkTag]);
    };
    return (
      <ShadowRoot.div>
        <ManagedCoralContextProvider>
          <div id="coral-app-container">
            {options.cssAssets.map((asset) => (
              <link key={asset} href={asset} rel="stylesheet" />
            ))}
            {injectedLinkTags.map((linkTag) => (
              <link
                key={linkTag.href}
                href={linkTag.href}
                rel={linkTag.rel}
                onLoad={linkTag.onload as any}
              />
            ))}
            <AppContainer />
          </div>
        </ManagedCoralContextProvider>
      </ShadowRoot.div>
    );
  };

  // eslint-disable-next-line no-restricted-globals
  ReactDOM.render(<Index />, options.element);
}

export async function remove(element: HTMLElement) {
  ReactDOM.unmountComponentAtNode(element);
}
