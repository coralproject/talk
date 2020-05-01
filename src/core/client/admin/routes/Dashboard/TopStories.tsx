import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useEffect, useState } from "react";

import { DailyTopStoriesJSON } from "coral-common/rest/dashboard/types";
import { useFetch } from "coral-framework/lib/relay";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "coral-ui/components/v2";

import styles from "./TopStories.css";

import createDashboardFetch from "./createDashboardFetch";

const TopStoriesFetch = createDashboardFetch<DailyTopStoriesJSON>(
  "topStoriesFetch",
  "/dashboard/top-stories-today"
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
          {topStories && topStories.length < 1 && (
            <TableRow>
              <Localized id="dashboard-top-stories-no-comments">
                <TableCell>No comments today.</TableCell>
              </Localized>
            </TableRow>
          )}
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
