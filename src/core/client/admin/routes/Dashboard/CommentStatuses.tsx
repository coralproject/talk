import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useEffect, useState } from "react";
import { PieChart, Pie, Legend, Tooltip } from "recharts";
import { Environment } from "relay-runtime";

import { CommentStatusesJSON } from "coral-common/rest/dashboard/types";
import { createFetch, useFetch } from "coral-framework/lib/relay";

import styles from "./CommentStatuses.css";

import { CHART_COLOR_PRIMARY, CHART_COLOR_SECONDARY } from "./ChartColors";

interface PieValue {
  name: string;
  value: number;
}

const CommentStatusesFetch = createFetch(
  "CommentStatusesFetch",
  async (environment: Environment, variables: any, { rest }) =>
    await rest.fetch<CommentStatusesJSON>("/dashboard/comment-statuses", {
      method: "GET",
    })
);

const CommentStatuses: FunctionComponent<Props> = ({
  locales: localesFromProps,
}) => {
  const commentStatusesFetch = useFetch(CommentStatusesFetch);
  const [commentStatuses, setCommentStatuses] = useState<PieValue[]>([]);
  useEffect(() => {
    async function getTotals() {
      const commentStatusesResp = await commentStatusesFetch(null);
      const json: PieValue[] = Object.keys(
        commentStatusesResp.commentStatuses
      ).map((key: keyof CommentStatusesJSON["commentStatuses"]) => {
        return {
          name: key,
          value: commentStatusesResp.commentStatuses[key],
        };
      });
      setCommentStatuses(json);
    }
    getTotals();
  }, []);
  return (
    <div>
      <Localized id="dashboard-comment-activity-heading">
        <h3 className={styles.heading}>Comment Statuses</h3>
      </Localized>
      {commentStatuses && (
        <PieChart
          width={730}
          height={250}
          className={styles.chart}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <Pie
            data={commentStatuses}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={50}
            fill="#8884d8"
          />
          <Legend />
          <Tooltip />
        </PieChart>
      )}
    </div>
  );
};

export default CommentStatuses;
