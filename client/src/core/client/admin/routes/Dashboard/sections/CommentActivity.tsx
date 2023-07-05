import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";

import { TimeSeriesMetricsJSON } from "coral-common/types/dashboard";
import { useDateTimeFormatter } from "coral-framework/hooks";
import { useImmediateFetch } from "coral-framework/lib/relay/fetch";
import { Flex } from "coral-ui/components/v2";

import { DashboardBox, DashboardComponentHeading, Loader } from "../components";
import createDashboardFetch from "../createDashboardFetch";
import {
  CHART_COLOR_GREY_200,
  CHART_COLOR_MONO_500,
  CHART_COLOR_PRIMARY_600,
  CHART_COLOR_SECONDARY_600,
} from "./ChartColors";
import CommentActivityTooltip from "./CommentActivityTooltip";

import styles from "./CommentActivity.css";

interface Props {
  siteID: string;
  lastUpdated: string;
}

const HourlyCommentsMetricsFetch = createDashboardFetch<TimeSeriesMetricsJSON>(
  "hourlyCommentsMetricsFetch",
  "/dashboard/hourly/comments"
);

const CommentActivity: FunctionComponent<Props> = ({ siteID, lastUpdated }) => {
  const [hourly, loading] = useImmediateFetch(
    HourlyCommentsMetricsFetch,
    { siteID },
    lastUpdated
  );
  const formatter = useDateTimeFormatter({
    hour: "numeric",
    hour12: true,
  });

  return (
    <DashboardBox>
      <Localized id="dashboard-comment-activity-heading">
        <DashboardComponentHeading>
          Hourly comment activity
        </DashboardComponentHeading>
      </Localized>
      <Loader loading={loading} height={300} />
      {!loading && (
        <>
          <ResponsiveContainer height={300}>
            <LineChart
              className={styles.chart}
              data={hourly ? hourly.series : []}
            >
              {hourly && (
                <ReferenceLine
                  stroke={CHART_COLOR_SECONDARY_600}
                  y={hourly.average}
                />
              )}
              <XAxis
                dataKey="timestamp"
                stroke={CHART_COLOR_MONO_500}
                axisLine={{ strokeWidth: 0 }}
                tick={{ fontSize: 12, fontWeight: 600 }}
                tickLine={false}
                dy={6}
                tickFormatter={(unixTime: number) =>
                  formatter(unixTime).toLowerCase().replace(" ", "")
                }
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
                stroke={CHART_COLOR_PRIMARY_600}
              />
              <Tooltip
                content={(tooltipProps: TooltipProps<any, any>) => (
                  <CommentActivityTooltip {...tooltipProps} />
                )}
              />
            </LineChart>
          </ResponsiveContainer>
          <Flex alignItems="center" justifyContent="center">
            <Localized id="dashboard-comment-activity-legend">
              <p className={styles.legend}>Average last 3 days</p>
            </Localized>
          </Flex>
        </>
      )}
    </DashboardBox>
  );
};

export default CommentActivity;
