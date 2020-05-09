import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
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

import { TimeSeriesMetricsJSON } from "coral-common/rest/dashboard/types";
import { useImmediateFetch } from "coral-framework/lib/relay/fetch";
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
  siteID: string;
}

const HourlyCommentsMetricsFetch = createDashboardFetch<TimeSeriesMetricsJSON>(
  "hourlyCommentsMetricsFetch",
  "/dashboard/hourly/comments"
);

const CommentActivity: FunctionComponent<Props> = ({
  locales: localesFromProps,
  siteID,
}) => {
  const hourly = useImmediateFetch(HourlyCommentsMetricsFetch, { siteID });
  const { locales: localesFromContext } = useUIContext();
  const locales = localesFromProps || localesFromContext || ["en-US"];
  return (
    <DashboardBox>
      <Localized id="dashboard-comment-activity-heading">
        <DashboardComponentHeading>
          Hourly comment activity
        </DashboardComponentHeading>
      </Localized>
      <ResponsiveContainer height={300}>
        <LineChart className={styles.chart} data={hourly ? hourly.series : []}>
          {hourly && (
            <ReferenceLine stroke={CHART_COLOR_SECONDARY} y={hourly.average} />
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
                hour12: true,
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
            formatter={(value) => [value, "Comments"]}
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
