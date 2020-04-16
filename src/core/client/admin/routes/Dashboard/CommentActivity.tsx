// import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useEffect, useState } from "react";
import { Legend, Line, LineChart, XAxis, YAxis } from "recharts";
import { Environment } from "relay-runtime";

import { createFetch, useFetch } from "coral-framework/lib/relay";
import { useUIContext } from "coral-ui/components";

interface CommentTotals {
  total: number;
  staff: number;
}

interface HourlyCounts {
  [timestamp: string]: CommentTotals;
}

interface RestResponse {
  comments: HourlyCounts;
}

type TotalsArr = CommentTotals & {
  time: number;
};

interface Props {
  locales?: string[];
}
const CommentActivityFetch = createFetch(
  "commentActivityFetch",
  async (environment: Environment, variables: any, { rest }) =>
    await rest.fetch<RestResponse>("/dashboard/hourly-comments", {
      method: "GET",
    })
);

const CommentActivity: FunctionComponent<Props> = ({
  locales: localesFromProps,
}) => {
  const commentActivityFetch = useFetch(CommentActivityFetch);
  const [commentActivity, setCommentActivity] = useState<TotalsArr[]>([]);
  const { locales: localesFromContext } = useUIContext();
  const locales = localesFromProps || localesFromContext || ["en-US"];
  useEffect(() => {
    async function getTotals() {
      const commentActivityResp = await commentActivityFetch(null);
      const json = Object.keys(commentActivityResp.comments).map(key => {
        const hour = commentActivityResp.comments[key];
        return {
          time: new Date(key).getTime(),
          staff: hour.staff,
          total: hour.total,
        };
      });
      setCommentActivity(json);
    }
    getTotals();
  }, []);
  return (
    <div>
      <h3>Comment Activity</h3>
      <LineChart
        width={730}
        height={250}
        data={commentActivity}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis
          dataKey="time"
          tickFormatter={(unixTime: number) => {
            const formatter = new Intl.DateTimeFormat(locales, {
              hour: "numeric",
              minute: "2-digit",
            });
            return formatter.format(new Date(unixTime));
          }}
        />
        <YAxis allowDecimals={false} />
        <Line type="linear" dataKey="staff" stroke="#8884d8" />
        <Line type="linear" dataKey="total" stroke="#82ca9d" />
        <Legend />
      </LineChart>
      <ul></ul>
    </div>
  );
};

export default CommentActivity;
