import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useEffect, useState } from "react";
import { Bar, BarChart, Tooltip, XAxis, YAxis } from "recharts";

import { DailySignupsJSON } from "coral-common/rest/dashboard/types";
import { useFetch } from "coral-framework/lib/relay";
import { useUIContext } from "coral-ui/components";

import { CHART_COLOR_PRIMARY } from "../ChartColors";
import createDashboardFetch from "../createDashboardFetch";

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
    <div>
      <Localized id="dashboard-commenters-activity-heading">
        <h3 className={styles.heading}>New Signups</h3>
      </Localized>
      <BarChart
        className={styles.chart}
        width={730}
        height={250}
        data={commenterActivity}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis
          dataKey="timestamp"
          tickFormatter={(unixTime: number) => {
            const formatter = new Intl.DateTimeFormat(locales, {
              day: "numeric",
              month: "numeric",
            });
            return formatter.format(new Date(unixTime));
          }}
        />
        <YAxis allowDecimals={false} />
        <Bar dataKey="count" fill={CHART_COLOR_PRIMARY} />
        <Tooltip />
      </BarChart>
    </div>
  );
};

export default CommenterActivity;
