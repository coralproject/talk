import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useEffect, useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Environment } from "relay-runtime";

import { CommentStatusesJSON } from "coral-common/rest/dashboard/types";
import { createFetch, useFetch } from "coral-framework/lib/relay";

import styles from "./CommentStatuses.css";

const COLOR_MAP = {
  public: "#268742",
  rejected: "#D53F3F",
  witheld: "#E5766C",
};

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
    <div className={styles.root}>
      <Localized id="dashboard-comment-activity-heading">
        <h3 className={styles.heading}>Community health (all-time)</h3>
      </Localized>
      {commentStatuses && (
        <ResponsiveContainer height={200}>
          <PieChart
            className={styles.chart}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <Pie data={commentStatuses} dataKey="value" nameKey="name">
              {commentStatuses.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLOR_MAP[entry.name]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default CommentStatuses;
