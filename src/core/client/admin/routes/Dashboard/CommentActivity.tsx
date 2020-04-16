// import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useEffect, useState } from "react";
import { Legend, Line, LineChart, XAxis, YAxis } from "recharts";
import { Environment } from "relay-runtime";

import { HourlyCommentsJSON } from "coral-common/rest/dashboard/types";
import { createFetch, useFetch } from "coral-framework/lib/relay";
import { useUIContext } from "coral-ui/components";

interface Props {
  locales?: string[];
}
const CommentActivityFetch = createFetch(
  "commentActivityFetch",
  async (environment: Environment, variables: any, { rest }) =>
    await rest.fetch<HourlyCommentsJSON>("/dashboard/hourly/comments", {
      method: "GET",
    })
);

interface CommentsByHour {
  timestamp: number;
  count: number;
  staffCount: number;
}

const CommentActivity: FunctionComponent<Props> = ({
  locales: localesFromProps,
}) => {
  const commentActivityFetch = useFetch(CommentActivityFetch);
  const [commentActivity, setCommentActivity] = useState<CommentsByHour[]>([]);
  const { locales: localesFromContext } = useUIContext();
  const locales = localesFromProps || localesFromContext || ["en-US"];
  useEffect(() => {
    async function getTotals() {
      const commentActivityResp = await commentActivityFetch(null);
      const json = commentActivityResp.comments.map(comment => {
        return {
          count: comment.count,
          staffCount: comment.byAuthorRole.staff.count,
          timestamp: new Date(comment.hour).getTime(),
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
        <Line type="linear" dataKey="staffCount" stroke="#8884d8" />
        <Line type="linear" dataKey="count" stroke="#82ca9d" />
        <Legend />
      </LineChart>
      <ul></ul>
    </div>
  );
};

export default CommentActivity;
