import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import { DailySignupsJSON } from "coral-common/rest/dashboard/types";
import { useFetch } from "coral-framework/lib/relay";
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
  siteID?: string;
}
const CommenterActivityFetch = createDashboardFetch<DailySignupsJSON>(
  "commenterActivityFetch",
  "/dashboard/daily-signups"
);

type NewCommentersByHour = DailySignupsJSON["counts"];

const CommenterActivity: FunctionComponent<Props> = ({
  locales: localesFromProps,
  siteID,
}) => {
  const commenterActivityFetch = useFetch(CommenterActivityFetch);
  const [commenterActivity, setCommenterActivity] = useState<
    NewCommentersByHour
  >([]);
  const { locales: localesFromContext } = useUIContext();
  const locales = localesFromProps || localesFromContext || ["en-US"];
  useEffect(() => {
    async function getTotals() {
      const { counts } = await commenterActivityFetch({ siteID });
      setCommenterActivity(counts);
    }
    getTotals();
  }, []);
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
          data={commenterActivity}
        >
          <CartesianGrid vertical={false} stroke={CHART_COLOR_GREY_200} />
          <XAxis
            height={36}
            stroke={CHART_COLOR_MONO_500}
            axisLine={{ strokeWidth: 0 }}
            tickLine={false}
            dataKey="timestamp"
            interval={0}
            tick={<SignupActivityTick locales={locales} />}
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
