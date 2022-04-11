import React, { FunctionComponent, useState } from "react";

import { parseQuery } from "coral-common/utils";
import { ExternalConfig } from "coral-framework/lib/externalConfig";
import { TabValue } from "coral-stream/App/App";

interface StreamLocalValue {
  storyID: string | undefined;
  setStoryID: React.Dispatch<React.SetStateAction<string | undefined>>;

  storyURL: string | undefined;
  setStoryURL: React.Dispatch<React.SetStateAction<string | undefined>>;

  activeTab: TabValue;
  setActiveTab: React.Dispatch<React.SetStateAction<TabValue>>;

  profileTab: string;
  setProfileTab: React.Dispatch<React.SetStateAction<string>>;
}

interface Props {
  config: ExternalConfig | null;
}

export const StreamLocalContext = React.createContext<
  StreamLocalValue | undefined
>(undefined);

const StreamLocal: FunctionComponent<Props> = ({ config, children }) => {
  const query = parseQuery(location.search);

  const [storyID, setStoryID] = useState<string | undefined>(query.storyID);
  const [storyURL, setStoryURL] = useState<string | undefined>(query.storyURL);

  const [activeTab, setActiveTab] = useState<TabValue>("COMMENTS");
  const [profileTab, setProfileTab] = useState<string>("MY_COMMENTS");

  const value: StreamLocalValue = {
    storyID,
    setStoryID,
    storyURL,
    setStoryURL,
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

export default StreamLocal;
