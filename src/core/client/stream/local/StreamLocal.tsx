import React, { FunctionComponent, useState } from "react";
import { Environment, fetchQuery, graphql } from "relay-runtime";

import { StaticConfig } from "coral-common/config";
import { parseQuery } from "coral-common/utils";
import { CoralContext } from "coral-framework/lib/bootstrap";
import getStaticConfig from "coral-framework/lib/getStaticConfig";
import { TabValue } from "coral-stream/App/App";
import { COMMENTS_ORDER_BY } from "coral-stream/constants";

import { GQLCOMMENT_SORT } from "coral-framework/schema/__generated__/types";
import { StreamLocalQuery } from "coral-stream/__generated__/StreamLocalQuery.graphql";

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

interface StreamLocalValue {
  storyID: string | undefined;
  setStoryID: React.Dispatch<React.SetStateAction<string | undefined>>;

  storyURL: string | undefined;
  setStoryURL: React.Dispatch<React.SetStateAction<string | undefined>>;

  storyMode: string | undefined;
  setStoryMode: React.Dispatch<React.SetStateAction<string | undefined>>;

  commentID: string | undefined;
  setCommentID: React.Dispatch<React.SetStateAction<string | undefined>>;

  commentsOrderBy: GQLCOMMENT_SORT;
  setCommentsOrderBy: React.Dispatch<React.SetStateAction<GQLCOMMENT_SORT>>;

  activeTab: TabValue;
  setActiveTab: React.Dispatch<React.SetStateAction<TabValue>>;

  profileTab: string;
  setProfileTab: React.Dispatch<React.SetStateAction<string>>;

  flattenReplies: boolean;
  setFlattenReplies: React.Dispatch<React.SetStateAction<boolean>>;

  featureFlags: string[];
  setFeatureFlags: React.Dispatch<React.SetStateAction<string[]>>;
}

const StreamLocalContext = React.createContext<StreamLocalValue>({} as any);

const createContext = async (context: CoralContext) => {
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

    const [commentsOrderByVal, setCommentsOrderByVal] = useState<
      GQLCOMMENT_SORT
    >(commentsOrderBy);

    const [activeTab, setActiveTab] = useState<TabValue>("COMMENTS");
    const [profileTab, setProfileTab] = useState<string>("MY_COMMENTS");

    const [flattenRepliesVal, setFlattenRepliesVal] = useState<boolean>(
      !!flattenReplies
    );

    const [featureFlagsVal, setFeatureFlagsVal] = useState<string[]>(
      featureFlags ?? []
    );

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
      flattenReplies: flattenRepliesVal,
      setFlattenReplies: setFlattenRepliesVal,
      featureFlags: featureFlagsVal,
      setFeatureFlags: setFeatureFlagsVal,
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
