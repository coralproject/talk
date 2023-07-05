import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import { TimeSeriesMetricsJSON } from "coral-common/types/dashboard";
import { useImmediateFetch } from "coral-framework/lib/relay/fetch";

import { DashboardBox, DashboardComponentHeading, Loader } from "../components";
import createDashboardFetch from "../createDashboardFetch";
import {
  CHART_COLOR_GREY_200,
  CHART_COLOR_MONO_500,
  CHART_COLOR_PRIMARY_100,
  CHART_COLOR_PRIMARY_600,
} from "./ChartColors";
import SignupActivityTick from "./SignupActivityTick";

import styles from "./SignupActivity.css";

interface Props {
  siteID: string;
  lastUpdated: string;
}
const DailySignupMetrics = createDashboardFetch<TimeSeriesMetricsJSON>(
  "commenterActivityFetch",
  "/dashboard/daily/users"
);

const CommenterActivity: FunctionComponent<Props> = ({
  siteID,
  lastUpdated,
}) => {
  const [daily, loading] = useImmediateFetch(
    DailySignupMetrics,
    { siteID },
    lastUpdated
  );

  return (
    <DashboardBox>
      <Localized id="dashboard-commenters-activity-heading">
        <DashboardComponentHeading>New Signups</DashboardComponentHeading>
      </Localized>
      <Loader loading={loading} height={300} />
      {!loading && (
        <ResponsiveContainer height={300}>
          <BarChart
            className={styles.chart}
            width={730}
            height={250}
            data={daily ? daily.series : []}
          >
            <CartesianGrid vertical={false} stroke={CHART_COLOR_GREY_200} />
            <XAxis
              height={36}
              stroke={CHART_COLOR_MONO_500}
              axisLine={{ strokeWidth: 0 }}
              tickLine={false}
              dataKey="timestamp"
              interval={0}
              tick={(props) => (
                <SignupActivityTick
                  isToday={
                    daily &&
                    daily.series &&
                    daily.series.length - 1 === props.index
                  }
                  {...props}
                />
              )}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              width={36}
              stroke={CHART_COLOR_MONO_500}
              axisLine={{ strokeWidth: 0 }}
              tick={{ fontSize: 12, fontWeight: 600 }}
            />
            <Bar dataKey="count">
              {(daily ? daily.series : []).map((entry, index) => {
                const isToday =
                  daily && daily.series && daily.series.length - 1 === index;
                return (
                  <Cell
                    key={entry.timestamp}
                    fill={
                      isToday
                        ? CHART_COLOR_PRIMARY_100
                        : CHART_COLOR_PRIMARY_600
                    }
                    stroke={isToday ? CHART_COLOR_PRIMARY_600 : undefined}
                    strokeWidth={2}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </DashboardBox>
  );
};

export default CommenterActivity;
