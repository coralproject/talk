import { Localized } from "@fluent/react/compat";
import { Link } from "found";
import React, { FunctionComponent } from "react";

import NotAvailable from "coral-admin/components/NotAvailable";
import { TodayStoriesMetricsJSON } from "coral-common/types/dashboard";
import { getModerationLink } from "coral-framework/helpers";
import { useImmediateFetch } from "coral-framework/lib/relay/fetch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextLink,
} from "coral-ui/components/v2";

import { DashboardBox, DashboardComponentHeading, Loader } from "../components";
import createDashboardFetch from "../createDashboardFetch";

const TodayStoriesMetrics = createDashboardFetch<TodayStoriesMetricsJSON>(
  "topStoriesFetch",
  "/dashboard/today/stories"
);

interface Props {
  siteID: string;
  lastUpdated: string;
}

const TopStories: FunctionComponent<Props> = ({ siteID, lastUpdated }) => {
  const [today, loading] = useImmediateFetch(
    TodayStoriesMetrics,
    { siteID },
    lastUpdated
  );
  return (
    <DashboardBox>
      <Localized id="dashboard-top-stories-today-heading">
        <DashboardComponentHeading>
          Today's most commented stories
        </DashboardComponentHeading>
      </Localized>
      <Table fullWidth>
        <TableHead>
          <TableRow>
            <Localized id="dashboard-top-stories-table-header-story">
              <TableCell>Story</TableCell>
            </Localized>
            <Localized id="dashboard-top-stories-table-header-comments">
              <TableCell align="end">Comments</TableCell>
            </Localized>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading && (
            <TableRow>
              <TableCell colSpan={2}>
                <Loader loading={loading} />
              </TableCell>
            </TableRow>
          )}
          {today && today.results.length < 1 && (
            <TableRow>
              <Localized id="dashboard-top-stories-no-comments">
                <TableCell colSpan={2}>No comments today.</TableCell>
              </Localized>
            </TableRow>
          )}
          {today &&
            today.results.map((result) => (
              <TableRow key={result.story.id}>
                <TableCell>
                  <Link
                    to={getModerationLink({ storyID: result.story.id })}
                    as={TextLink}
                  >
                    {result.story.title ? result.story.title : <NotAvailable />}
                  </Link>
                </TableCell>
                <TableCell align="end">{result.count}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </DashboardBox>
  );
};

export default TopStories;
