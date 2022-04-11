import React, { FunctionComponent, useState } from "react";

import { parseQuery } from "coral-common/utils";
import { CoralContext } from "coral-framework/lib/bootstrap";
import { TabValue } from "coral-stream/App/App";
import { COMMENTS_ORDER_BY } from "coral-stream/constants";

import { GQLCOMMENT_SORT } from "coral-framework/schema/__generated__/types";

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
}

const StreamLocalContext = React.createContext<StreamLocalValue>({} as any);

export const useStreamLocal = () => React.useContext(StreamLocalContext);

const createContext = async (context: CoralContext) => {
  let commentsOrder: GQLCOMMENT_SORT = GQLCOMMENT_SORT.CREATED_AT_DESC;
  const stringOrderBy = await context.localStorage.getItem(COMMENTS_ORDER_BY);
  if (stringOrderBy) {
    commentsOrder = (typeof GQLCOMMENT_SORT as any)[stringOrderBy];
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

    const [commentsOrderBy, setCommentsOrderBy] = useState<GQLCOMMENT_SORT>(
      commentsOrder
    );

    const [activeTab, setActiveTab] = useState<TabValue>("COMMENTS");
    const [profileTab, setProfileTab] = useState<string>("MY_COMMENTS");

    const value: StreamLocalValue = {
      storyID,
      setStoryID,
      storyURL,
      setStoryURL,
      storyMode,
      setStoryMode,
      commentID,
      setCommentID,
      commentsOrderBy,
      setCommentsOrderBy,
      activeTab,
      setActiveTab,
      profileTab,
      setProfileTab,
    };

    return (
      <StreamLocalContext.Provider value={value}>
        {children}
      </StreamLocalContext.Provider>
    );
  };

  return StreamLocal;
};

export default createContext;
