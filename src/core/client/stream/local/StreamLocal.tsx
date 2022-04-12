import React, { FunctionComponent, useState } from "react";
import { Environment, fetchQuery, graphql } from "relay-runtime";

import { StaticConfig } from "coral-common/config";
import { DEFAULT_AUTO_ARCHIVE_OLDER_THAN } from "coral-common/constants";
import { parseQuery } from "coral-common/utils";
import { AuthState, parseAccessToken } from "coral-framework/lib/auth";
import { CoralContext } from "coral-framework/lib/bootstrap";
import { getExternalConfig } from "coral-framework/lib/externalConfig";
import getStaticConfig from "coral-framework/lib/getStaticConfig";
import { COMMENTS_ORDER_BY } from "coral-stream/constants";

import {
  GQLCOMMENT_SORT,
  GQLFEATURE_FLAG,
} from "coral-framework/schema/__generated__/types";
import { StreamLocalQuery } from "coral-stream/__generated__/StreamLocalQuery.graphql";

import { ACTIVE_TAB, AUTH_VIEW, COMMENT_SORT, COMMENTS_TAB } from "./types";

interface ResolvedConfig {
  readonly featureFlags: string[];
  readonly flattenReplies?: boolean | null;
}

async function resolveConfig(
  environment: Environment,
  staticConfig?: StaticConfig | null
): Promise<ResolvedConfig> {
  if (staticConfig) {
    return staticConfig as ResolvedConfig;
  }
  if (process.env.NODE_ENV === "development") {
    // Send a graphql query to server during development to get the needed settings.
    // The reason is that we don't have static config during development.
    const data = await fetchQuery<StreamLocalQuery>(
      environment,
      graphql`
        query StreamLocalQuery {
          settings {
            flattenReplies
            featureFlags
          }
        }
      `,
      {}
    );

    return data.settings as ResolvedConfig;
  }
  return {
    featureFlags: [],
    flattenReplies: false,
  };
}

interface StreamLocalKeyboardShortcuts {
  key: string;
  setKey: React.Dispatch<React.SetStateAction<string>>;

  source: string;
  setSource: React.Dispatch<React.SetStateAction<string>>;

  reverse: boolean;
  setReverse: React.Dispatch<React.SetStateAction<boolean>>;
}

interface StreamLocalAuth {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;

  focus: boolean;
  setFocus: React.Dispatch<React.SetStateAction<boolean>>;

  view: AUTH_VIEW | null;
  setView: React.Dispatch<React.SetStateAction<AUTH_VIEW | null>>;

  href: string;
  setHref: React.Dispatch<React.SetStateAction<string>>;
}

interface StreamLocalValue {
  storyID: string | undefined;
  setStoryID: React.Dispatch<React.SetStateAction<string | undefined>>;

  storyURL: string | undefined;
  setStoryURL: React.Dispatch<React.SetStateAction<string | undefined>>;

  storyMode: string | undefined;
  setStoryMode: React.Dispatch<React.SetStateAction<string | undefined>>;

  commentID: string | undefined;
  setCommentID: React.Dispatch<React.SetStateAction<string | undefined>>;

  commentsOrderBy: COMMENT_SORT;
  setCommentsOrderBy: React.Dispatch<React.SetStateAction<COMMENT_SORT>>;

  activeTab: ACTIVE_TAB;
  setActiveTab: React.Dispatch<React.SetStateAction<ACTIVE_TAB>>;

  profileTab: string;
  setProfileTab: React.Dispatch<React.SetStateAction<string>>;

  commentsTab: COMMENTS_TAB;
  setCommentsTab: React.Dispatch<React.SetStateAction<COMMENTS_TAB>>;

  flattenReplies: boolean;
  setFlattenReplies: React.Dispatch<React.SetStateAction<boolean>>;

  featureFlags: string[];
  setFeatureFlags: React.Dispatch<React.SetStateAction<string[]>>;

  enableZKey: boolean;
  setEnableZKey: React.Dispatch<React.SetStateAction<boolean>>;

  useAmp: boolean;
  setUseAmp: React.Dispatch<React.SetStateAction<boolean>>;

  enableCommentSeen: boolean;
  setEnableCommentSeen: React.Dispatch<React.SetStateAction<boolean>>;

  ratingFilter: number | null;
  setRatingFilter: React.Dispatch<React.SetStateAction<number | null>>;

  archivingEnabled: boolean;
  setArchivingEnabled: React.Dispatch<React.SetStateAction<boolean>>;

  autoArchiveOlderThanMs: number;
  setAutoArchiveOlderThanMs: React.Dispatch<React.SetStateAction<number>>;

  authPopup: StreamLocalAuth;
  keyboardShortcutsConfig: StreamLocalKeyboardShortcuts;
}

const StreamLocalContext = React.createContext<StreamLocalValue>({} as any);

const createContext = async (
  context: CoralContext,
  auth?: AuthState | null
) => {
  const config = await getExternalConfig(context.window, context.pym);
  if (config) {
    if (config.accessToken) {
      // Access tokens passed via the config should not be persisted.
      auth = parseAccessToken(config.accessToken);
    }
    // append body class name if set in config.
    if (config.bodyClassName) {
      context.window.document.body.classList.add(config.bodyClassName);
    }
  }

  const staticConfig = getStaticConfig(context.window);

  const { featureFlags, flattenReplies } = await resolveConfig(
    context.relayEnvironment,
    staticConfig
  );

  let commentsOrderBy: GQLCOMMENT_SORT = GQLCOMMENT_SORT.CREATED_AT_DESC;
  const stringOrderBy = await context.localStorage.getItem(COMMENTS_ORDER_BY);
  if (stringOrderBy) {
    commentsOrderBy = (typeof GQLCOMMENT_SORT as any)[stringOrderBy];
  }

  const StreamLocal: FunctionComponent = ({ children }) => {
    const query = parseQuery(location.search);

    const [storyID, setStoryID] = useState<string | undefined>(query.storyID);
    const [storyURL, setStoryURL] = useState<string | undefined>(
      query.storyURL
    );
    const [storyMode, setStoryMode] = useState<string | undefined>(
      query.storyMode
    );
    const [commentID, setCommentID] = useState<string | undefined>(
      query.commentID
    );

    const [commentsOrderByVal, setCommentsOrderByVal] = useState<COMMENT_SORT>(
      commentsOrderBy
    );

    const [activeTab, setActiveTab] = useState<ACTIVE_TAB>("COMMENTS");
    const [profileTab, setProfileTab] = useState<string>("MY_COMMENTS");
    const [commentsTab, setCommentsTab] = useState<COMMENTS_TAB>("NONE");

    const [flattenRepliesVal, setFlattenRepliesVal] = useState<boolean>(
      !!flattenReplies
    );

    const [featureFlagsVal, setFeatureFlagsVal] = useState<string[]>(
      featureFlags ?? []
    );

    const [enableZKey, setEnableZKey] = useState<boolean>(
      featureFlags.includes(GQLFEATURE_FLAG.Z_KEY)
    );

    const [useAmp, setUseAmp] = useState<boolean>(Boolean(config?.amp));

    const [enableCommentSeen, setEnableCommentSeen] = useState<boolean>(
      featureFlags.includes(GQLFEATURE_FLAG.COMMENT_SEEN)
    );

    const [ratingFilter, setRatingFilter] = useState<number | null>(null);

    const [archivingEnabled, setArchivingEnabled] = useState<boolean>(
      staticConfig?.archivingEnabled || false
    );
    const [autoArchiveOlderThanMs, setAutoArchiveOlderThanMs] = useState<
      number
    >(staticConfig?.autoArchiveOlderThanMs ?? DEFAULT_AUTO_ARCHIVE_OLDER_THAN);

    // Auth
    const [authOpen, setAuthOpen] = useState<boolean>(false);
    const [authFocus, setAuthFocus] = useState<boolean>(false);
    const [authView, setAuthView] = useState<AUTH_VIEW | null>(null);
    const [authHref, setAuthHref] = useState<string>("");

    // Keyboard Shortcuts
    const [keysKey, setKeysKey] = useState<string>("");
    const [keysSource, setKeysSource] = useState<string>("");
    const [keysReverse, setKeysReverse] = useState<boolean>(false);

    const value: StreamLocalValue = {
      storyID,
      setStoryID,
      storyURL,
      setStoryURL,
      storyMode,
      setStoryMode,
      commentID,
      setCommentID,
      commentsOrderBy: commentsOrderByVal,
      setCommentsOrderBy: setCommentsOrderByVal,
      activeTab,
      setActiveTab,
      profileTab,
      setProfileTab,
      commentsTab,
      setCommentsTab,
      flattenReplies: flattenRepliesVal,
      setFlattenReplies: setFlattenRepliesVal,
      featureFlags: featureFlagsVal,
      setFeatureFlags: setFeatureFlagsVal,
      enableZKey,
      setEnableZKey,
      useAmp,
      setUseAmp,
      enableCommentSeen,
      setEnableCommentSeen,
      ratingFilter,
      setRatingFilter,
      archivingEnabled,
      setArchivingEnabled,
      autoArchiveOlderThanMs,
      setAutoArchiveOlderThanMs,
      authPopup: {
        open: authOpen,
        setOpen: setAuthOpen,
        focus: authFocus,
        setFocus: setAuthFocus,
        view: authView,
        setView: setAuthView,
        href: authHref,
        setHref: setAuthHref,
      },
      keyboardShortcutsConfig: {
        key: keysKey,
        setKey: setKeysKey,
        source: keysSource,
        setSource: setKeysSource,
        reverse: keysReverse,
        setReverse: setKeysReverse,
      },
    };

    return (
      <StreamLocalContext.Provider value={value}>
        {children}
      </StreamLocalContext.Provider>
    );
  };

  return StreamLocal;
};

export const useStreamLocal = () => React.useContext(StreamLocalContext);

export default createContext;
