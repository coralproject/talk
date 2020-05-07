import { Localized } from "@fluent/react/compat";
import { Link } from "found";
import React, { FunctionComponent, useEffect, useState } from "react";

import NotAvailable from "coral-admin/components/NotAvailable";
import { DailyTopStoriesJSON } from "coral-common/rest/dashboard/types";
import { getModerationLink } from "coral-framework/helpers";
import { useFetch } from "coral-framework/lib/relay";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextLink,
} from "coral-ui/components/v2";

import { DashboardBox } from "../components";
import createDashboardFetch from "../createDashboardFetch";

import styles from "./TopStories.css";

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
    <DashboardBox>
      <Localized id="dashboard-top-stories-today-heading">
        <h3 className={styles.heading}>Today's most commented stories</h3>
      </Localized>
      <Table fullWidth>
        <TableHead>
          <TableRow>
            <Localized id="dashboard-top-stories-heading-stories">
              <TableCell>Story</TableCell>
            </Localized>
            <Localized id="dashboard-top-stories-heading-comments">
              <TableCell align="end">Comments</TableCell>
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
                  <Link
                    to={getModerationLink({ storyID: topStory.id })}
                    as={TextLink}
                  >
                    {topStory.metadata ? (
                      topStory.metadata.title || <NotAvailable />
                    ) : (
                      <NotAvailable />
                    )}
                  </Link>
                </TableCell>
                <TableCell align="end">{topStory.comments.count}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </DashboardBox>
  );
};

export default TopStories;
