// import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useEffect, useState } from "react";
import { Environment } from "relay-runtime";

import { createFetch, useFetch } from "coral-framework/lib/relay";
import {} from "coral-ui/components/v2";

import { DailyTopStoriesJSON } from "coral-common/rest/dashboard/types";

const TopStoriesFetch = createFetch(
  "TopStoriesFetch",
  async (environment: Environment, variables: any, { rest }) =>
    await rest.fetch<DailyTopStoriesJSON>("/dashboard/daily/top-stories", {
      method: "GET",
    })
);

const TopStories: FunctionComponent = () => {
  const topStoriesFetch = useFetch(TopStoriesFetch);
  const [topStories, setTopStories] = useState<
    DailyTopStoriesJSON["topStories"] | null
  >(null);
  useEffect(() => {
    async function getTotals() {
      const resp = await topStoriesFetch(null);
      setTopStories(resp.topStories);
    }
    getTotals();
  }, []);
  return (
    <div>
      <h3>Top Stories Today</h3>
      <ul>
        {topStories &&
          topStories.map(topStory => (
            <li key={topStory.id}>
              <strong>
                {topStory.metadata && topStory.metadata.title
                  ? topStory.metadata.title
                  : "N/A"}
              </strong>
              {": "}
              {topStory.comments.count}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default TopStories;
