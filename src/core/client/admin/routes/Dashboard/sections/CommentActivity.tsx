import { Localized } from "@fluent/react/compat";
import { isNumber } from "lodash";
import React, { FunctionComponent, useEffect, useState } from "react";
import {
  Line,
  LineChart,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { HourlyCommentsJSON } from "coral-common/rest/dashboard/types";
import { useFetch } from "coral-framework/lib/relay";
import { useUIContext } from "coral-ui/components";

import styles from "./CommentActivity.css";

import { CHART_COLOR_SECONDARY } from "../ChartColors";

import createDashboardFetch from "../createDashboardFetch";

interface Props {
  locales?: string[];
  siteID?: string;
}

const CommentActivityFetch = createDashboardFetch<HourlyCommentsJSON>(
  "commentActivityFetch",
  "/dashboard/hourly-comments"
);

type CommentsForHour = HourlyCommentsJSON["counts"];

const CommentActivity: FunctionComponent<Props> = ({
  locales: localesFromProps,
  siteID,
}) => {
  const commentActivityFetch = useFetch(CommentActivityFetch);
  const [commentActivity, setCommentActivity] = useState<CommentsForHour>([]);
  const [averageComments, setAverageComments] = useState<number | null>(null);
  const { locales: localesFromContext } = useUIContext();
  const locales = localesFromProps || localesFromContext || ["en-US"];
  useEffect(() => {
    async function getTotals() {
      const { counts, average } = await commentActivityFetch({ siteID });
      setCommentActivity(counts);
      setAverageComments(average);
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
        {isNumber(averageComments) && (
          <ReferenceLine stroke="pink" y={averageComments} label="Average" />
        )}
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
