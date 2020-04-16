// import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useEffect, useState } from "react";
import { Bar, BarChart, Legend, XAxis, YAxis } from "recharts";
import { Environment } from "relay-runtime";

import { HourlyNewCommentersJSON } from "coral-common/rest/dashboard/types";

import { createFetch, useFetch } from "coral-framework/lib/relay";
import { useUIContext } from "coral-ui/components";

interface Props {
  locales?: string[];
}
const CommenterActivityFetch = createFetch(
  "commenterActivityFetch",
  async (environment: Environment, variables: any, { rest }) =>
    await rest.fetch<HourlyNewCommentersJSON>(
      "/dashboard/hourly/new-commenters",
      {
        method: "GET",
      }
    )
);

interface NewCommentersByHour {
  count: number;
  timestamp: number;
}

const CommenterActivity: FunctionComponent<Props> = ({
  locales: localesFromProps,
}) => {
  const commenterActivityFetch = useFetch(CommenterActivityFetch);
  const [commenterActivity, setCommenterActivity] = useState<
    NewCommentersByHour[]
  >([]);
  const { locales: localesFromContext } = useUIContext();
  const locales = localesFromProps || localesFromContext || ["en-US"];
  useEffect(() => {
    async function getTotals() {
      const commenterActivityResp = await commenterActivityFetch(null);
      const json = commenterActivityResp.newCommenters.map(
        ({ hour, count }) => {
          return {
            timestamp: new Date(hour).getTime(),
            count,
          };
        }
      );
      setCommenterActivity(json);
    }
    getTotals();
  }, []);
  return (
    <div>
      <h3>New Commenters Activity</h3>
      <BarChart
        width={730}
        height={250}
        data={commenterActivity}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
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
        <Bar dataKey="count" stroke="#82ca9d" />
        <Legend />
      </BarChart>
      <ul></ul>
    </div>
  );
};

export default CommenterActivity;
