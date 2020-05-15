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

import { TimeSeriesMetricsJSON } from "coral-common/rest/dashboard/types";
import { useImmediateFetch } from "coral-framework/lib/relay/fetch";
import { useUIContext } from "coral-ui/components";

import { DashboardBox, DashboardComponentHeading, Loader } from "../components";
import createDashboardFetch from "../createDashboardFetch";
import {
  CHART_COLOR_GREY_200,
  CHART_COLOR_MONO_500,
  CHART_COLOR_PRIMARY_LIGHT,
  CHART_COLOR_PRIMARY_PALE,
} from "./ChartColors";
import SignupActivityTick from "./SignupActivityTick";

import styles from "./SignupActivity.css";

interface Props {
  locales?: string[];
  siteID: string;
  lastUpdated: string;
}
const DailySignupMetrics = createDashboardFetch<TimeSeriesMetricsJSON>(
  "commenterActivityFetch",
  "/dashboard/daily/users"
);

const CommenterActivity: FunctionComponent<Props> = ({
  locales: localesFromProps,
  siteID,
  lastUpdated,
}) => {
  const [daily, loading] = useImmediateFetch(
    DailySignupMetrics,
    { siteID },
    lastUpdated
  );
  const { locales: localesFromContext } = useUIContext();
  const locales = localesFromProps || localesFromContext || ["en-US"];
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
                  locales={locales}
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
                return (
                  <Cell
                    key={entry.timestamp}
                    fill={
                      daily && daily.series && daily.series.length - 1 === index
                        ? CHART_COLOR_PRIMARY_PALE
                        : CHART_COLOR_PRIMARY_LIGHT
                    }
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
