import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useEffect, useState } from "react";
import { Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { Environment } from "relay-runtime";

import { HourlyCommentsJSON } from "coral-common/rest/dashboard/types";
import { createFetch, useFetch } from "coral-framework/lib/relay";
import { useUIContext } from "coral-ui/components";

import styles from "./CommentActivity.css";

import { CHART_COLOR_SECONDARY } from "./ChartColors";

interface Props {
  locales?: string[];
  siteID?: string;
}
const CommentActivityFetch = createFetch(
  "commentActivityFetch",
  async (environment: Environment, variables: any, { rest }) => {
    const url = `/dashboard/${
      variables.siteID ? variables.siteID + "/" : ""
    }comments/hourly`;
    return rest.fetch<HourlyCommentsJSON>(url, {
      method: "GET",
    });
  }
);

type CommentsForHour = HourlyCommentsJSON["hours"];

const CommentActivity: FunctionComponent<Props> = ({
  locales: localesFromProps,
  siteID,
}) => {
  const commentActivityFetch = useFetch(CommentActivityFetch);
  const [commentActivity, setCommentActivity] = useState<CommentsForHour>([]);
  const { locales: localesFromContext } = useUIContext();
  const locales = localesFromProps || localesFromContext || ["en-US"];
  useEffect(() => {
    async function getTotals() {
      const { hours } = await commentActivityFetch({ siteID });
      setCommentActivity(hours);
    }
    getTotals();
  }, []);
  return (
    <div>
      <Localized id="dashboard-comment-activity-heading">
        <h3 className={styles.heading}>Comment Activity</h3>
      </Localized>
      <LineChart
        width={730}
        height={250}
        className={styles.chart}
        data={commentActivity}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis
          dataKey="timestamp"
          tickFormatter={(unixTime: number) => {
            const formatter = new Intl.DateTimeFormat(locales, {
              hour: "numeric",
              minute: "2-digit",
            });
            return formatter.format(new Date(unixTime));
          }}
        />
        <YAxis allowDecimals={false} />
        <Line
          dot={false}
          type="linear"
          dataKey="count"
          stroke={CHART_COLOR_SECONDARY}
        />
        <Tooltip />
      </LineChart>
    </div>
  );
};

export default CommentActivity;
