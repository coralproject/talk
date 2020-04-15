// import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useEffect, useState } from "react";
import { Environment } from "relay-runtime";

import { createFetch, useFetch } from "coral-framework/lib/relay";
import {} from "coral-ui/components/v2";

interface TopStory {
  story: {
    metadata?: {
      title?: string;
    };
    id: string;
    url: string;
  };
  count: number;
}

interface RestResponse {
  stories: TopStory[];
}

const TopStoriesFetch = createFetch(
  "TopStoriesFetch",
  async (environment: Environment, variables: any, { rest }) =>
    await rest.fetch<RestResponse>("/dashboard/daily-top-stories", {
      method: "GET",
    })
);

const TopStories: FunctionComponent = () => {
  const topStoriesFetch = useFetch(TopStoriesFetch);
  const [topStories, setTopStories] = useState<TopStory[]>([]);
  useEffect(() => {
    async function getTotals() {
      const topStoriesResp = await topStoriesFetch(null);
      setTopStories(topStoriesResp.stories);
    }
    getTotals();
  }, []);
  return (
    <div>
      <h3>Top Stories Today</h3>
      <ul>
        {topStories.map(topStory => (
          <li key={topStory.story.id}>
            <strong>
              {topStory.story.metadata && topStory.story.metadata.title
                ? topStory.story.metadata.title
                : "N/A"}
            </strong>
            {": "}
            {topStory.count}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopStories;
