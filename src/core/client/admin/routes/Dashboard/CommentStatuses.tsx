import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Environment } from "relay-runtime";

import { CommentStatusesJSON } from "coral-common/rest/dashboard/types";
import { createFetch, useFetch } from "coral-framework/lib/relay";

import { CHART_COLOR_PRIMARY } from "./ChartColors";

import styles from "./CommentStatuses.css";

interface PieValue {
  name: string;
  value: number;
}

const CommentStatusesFetch = createFetch(
  "CommentStatusesFetch",
  async (environment: Environment, variables: any, { rest }) => {
    const url = `/dashboard/${
      variables.siteID ? variables.siteID + "/" : ""
    }community-health`;
    return rest.fetch<CommentStatusesJSON>(url, {
      method: "GET",
    });
  }
);

interface Props {
  siteID?: string;
}

const CommentStatuses: FunctionComponent<Props> = ({ siteID }) => {
  const commentStatusesFetch = useFetch(CommentStatusesFetch);
  const [commentStatuses, setCommentStatuses] = useState<PieValue[]>([]);
  useEffect(() => {
    async function getTotals() {
      const commentStatusesResp = await commentStatusesFetch({ siteID });
      const total = Object.keys(commentStatusesResp.commentStatuses).reduce(
        (acc, key: keyof CommentStatusesJSON["commentStatuses"]) => {
          return acc + commentStatusesResp.commentStatuses[key];
        },
        0
      );
      const json: PieValue[] = Object.keys(
        commentStatusesResp.commentStatuses
      ).map((key: keyof CommentStatusesJSON["commentStatuses"]) => {
        const value = commentStatusesResp.commentStatuses[key];
        const percent = (value / total) * 100;
        return {
          name: key,
          value: percent,
        };
      });
      setCommentStatuses(json);
    }
    getTotals();
  }, []);
  return (
    <div className={styles.root}>
      <Localized id="dashboard-comment-activity-heading">
        <h3 className={styles.heading}>Community health (all-time)</h3>
      </Localized>
      {commentStatuses && (
        <ResponsiveContainer height={200}>
          <BarChart data={commentStatuses} className={styles.chart}>
            <Bar dataKey="value" fill={CHART_COLOR_PRIMARY} />
            <XAxis dataKey="name" />
            <YAxis dataKey="value" />
            <Tooltip />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default CommentStatuses;
