import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useEffect, useState } from "react";
import { Environment } from "relay-runtime";

import { DailyTopStoriesJSON } from "coral-common/rest/dashboard/types";
import { createFetch, useFetch } from "coral-framework/lib/relay";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "coral-ui/components/v2";

import styles from "./TopStories.css";

const TopStoriesFetch = createFetch(
  "TopStoriesFetch",
  async (environment: Environment, variables: any, { rest }) => {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const url = `/dashboard/${
      variables.siteID ? variables.siteID + "/" : ""
    }top-stories/today?tz=${zone}`;
    return rest.fetch<DailyTopStoriesJSON>(url, {
      method: "GET",
    });
  }
);

interface Props {
  siteID?: string;
}

const TopStories: FunctionComponent<Props> = ({ siteID }) => {
  const topStoriesFetch = useFetch(TopStoriesFetch);
  const [topStories, setTopStories] = useState<
    DailyTopStoriesJSON["topStories"] | null
  >(null);
  useEffect(() => {
    async function getTotals() {
      const resp = await topStoriesFetch({ siteID });
      setTopStories(resp.topStories);
    }
    getTotals();
  }, []);
  return (
    <div>
      <Localized id="dashboard-top-stories-today-heading">
        <h3 className={styles.heading}>Top stories</h3>
      </Localized>
      <Table>
        <TableHead>
          <TableRow>
            <Localized id="dashboard-top-stories-heading-stories">
              <TableCell>Top commented stories today</TableCell>
            </Localized>
            <Localized id="dashboard-top-stories-heading-comments">
              <TableCell>New comments today</TableCell>
            </Localized>
          </TableRow>
        </TableHead>
        <TableBody>
          {topStories &&
            topStories.map((topStory) => (
              <TableRow key={topStory.id}>
                <TableCell>
                  {topStory.metadata && topStory.metadata.title
                    ? topStory.metadata.title
                    : "N/A"}
                </TableCell>
                <TableCell>{topStory.comments.count}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TopStories;
