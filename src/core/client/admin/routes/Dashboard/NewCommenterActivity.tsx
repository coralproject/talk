import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useEffect, useState } from "react";
import { Bar, BarChart, Tooltip, XAxis, YAxis } from "recharts";
import { Environment } from "relay-runtime";

import { SignupsDailyJSON } from "coral-common/rest/dashboard/types";
import { createFetch, useFetch } from "coral-framework/lib/relay";
import { useUIContext } from "coral-ui/components";

import { CHART_COLOR_PRIMARY } from "./ChartColors";

import styles from "./NewCommenterActivity.css";

interface Props {
  locales?: string[];
  siteID?: string;
}
const CommenterActivityFetch = createFetch(
  "commenterActivityFetch",
  async (environment: Environment, variables: any, { rest }) => {
    const url = `/dashboard/${
      variables.siteID ? variables.siteID + "/" : ""
    }signups/week`;
    return rest.fetch<SignupsDailyJSON>(url, {
      method: "GET",
    });
  }
);

type NewCommentersByHour = SignupsDailyJSON["signups"]["days"];

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
      const { signups } = await commenterActivityFetch({ siteID });
      setCommenterActivity(signups.days);
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
