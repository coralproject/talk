import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
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
  CHART_COLOR_PRIMARY_LIGHT,
} from "./ChartColors";
import SignupActivityTick from "./SignupActivityTick";

import styles from "./SignupActivity.css";

interface Props {
  locales?: string[];
  siteID: string;
}
const DailySignupMetrics = createDashboardFetch<TimeSeriesMetricsJSON>(
  "commenterActivityFetch",
  "/dashboard/daily/users"
);

const CommenterActivity: FunctionComponent<Props> = ({
  locales: localesFromProps,
  siteID,
}) => {
  const daily = useImmediateFetch(DailySignupMetrics, { siteID });
  const { locales: localesFromContext } = useUIContext();
  const locales = localesFromProps || localesFromContext || ["en-US"];
  return (
    <DashboardBox>
      <Localized id="dashboard-commenters-activity-heading">
        <DashboardComponentHeading>New Signups</DashboardComponentHeading>
      </Localized>
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
              <SignupActivityTick locales={locales} {...props} />
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
          <Bar dataKey="count" fill={CHART_COLOR_PRIMARY_LIGHT} />
        </BarChart>
      </ResponsiveContainer>
    </DashboardBox>
  );
};

export default CommenterActivity;
