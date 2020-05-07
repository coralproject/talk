import { Localized } from "@fluent/react/compat";
import { isNumber } from "lodash";
import React, { FunctionComponent, useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { HourlyCommentsJSON } from "coral-common/rest/dashboard/types";
import { useFetch } from "coral-framework/lib/relay";
import { useUIContext } from "coral-ui/components";

import { DashboardBox, DashboardComponentHeading } from "../components";
import createDashboardFetch from "../createDashboardFetch";
import {
  CHART_COLOR_GREY_200,
  CHART_COLOR_MONO_500,
  CHART_COLOR_PRIMARY,
  CHART_COLOR_SECONDARY,
} from "./ChartColors";

import styles from "./CommentActivity.css";

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
    <DashboardBox>
      <Localized id="dashboard-comment-activity-heading">
        <DashboardComponentHeading>
          Hourly comment activity
        </DashboardComponentHeading>
      </Localized>
      <ResponsiveContainer height={300}>
        <LineChart className={styles.chart} data={commentActivity}>
          {isNumber(averageComments) && (
            <ReferenceLine stroke={CHART_COLOR_SECONDARY} y={averageComments} />
          )}
          <XAxis
            dataKey="timestamp"
            stroke={CHART_COLOR_MONO_500}
            axisLine={{ strokeWidth: 0 }}
            tick={{ fontSize: 12, fontWeight: 600 }}
            tickLine={false}
            dy={6}
            tickFormatter={(unixTime: number) => {
              const formatter = new Intl.DateTimeFormat(locales, {
                hour: "numeric",
              });
              return formatter
                .format(new Date(unixTime))
                .toLowerCase()
                .replace(" ", "");
            }}
          />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            width={36}
            stroke={CHART_COLOR_MONO_500}
            axisLine={{ strokeWidth: 0 }}
            tick={{ fontSize: 12, fontWeight: 600 }}
          />
          <CartesianGrid vertical={false} stroke={CHART_COLOR_GREY_200} />
          <Line
            strokeWidth={2}
            dot={{ strokeWidth: 1 }}
            type="monotoneX"
            dataKey="count"
            stroke={CHART_COLOR_PRIMARY}
          />
          <Tooltip
            formatter={(value, name) => [value, "Comments"]}
            labelStyle={{ color: CHART_COLOR_MONO_500 }}
            labelFormatter={(unixTime: number) => {
              const formatter = new Intl.DateTimeFormat(locales, {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });
              return formatter.format(new Date(unixTime)).toLowerCase();
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </DashboardBox>
  );
};

export default CommentActivity;
