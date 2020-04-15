// import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useEffect, useState } from "react";
import { Environment } from "relay-runtime";

import { createFetch, useFetch } from "coral-framework/lib/relay";
import {} from "coral-ui/components/v2";

// interface Props {}
interface CommentTotals {
  total: number;
  staff: number;
}

interface CommentsRestResponse {
  comments: CommentTotals;
}

interface CommentersRestResponse {
  commenters: number;
}

const TodayTotalsFetch = createFetch(
  "todayTotalsFetch",
  async (environment: Environment, variables: any, { rest }) =>
    await rest.fetch<CommentsRestResponse>("/dashboard/daily-comments", {
      method: "GET",
    })
);

const TodayNewCommentersFetch = createFetch(
  "newCommentersFetch",
  async (environment: Environment, variables: any, { rest }) =>
    await rest.fetch<CommentersRestResponse>("/dashboard/daily-commenters", {
      method: "GET",
    })
);

const TodayTotals: FunctionComponent = () => {
  const todayTotalsFetch = useFetch(TodayTotalsFetch);
  const newComentersFetch = useFetch(TodayNewCommentersFetch);
  const [totalComents, setTotalComments] = useState<CommentTotals | null>(null);
  const [
    newCommenters,
    setNewCommenters,
  ] = useState<CommentersRestResponse | null>(null);
  useEffect(() => {
    async function getTotals() {
      const todayTotals = await todayTotalsFetch(null);
      setTotalComments(todayTotals.comments);
      const newCommenterResp = await newComentersFetch(null);
      setNewCommenters(newCommenterResp);
    }
    getTotals();
  }, []);
  return (
    <div>
      <h3>Daily totals</h3>
      <ul>
        {totalComents && (
          <>
            <li>
              <strong>Total comments:</strong> {totalComents.total}
            </li>
            <li>
              <strong>Staff comments:</strong> {totalComents.staff}
            </li>
          </>
        )}
        {newCommenters && (
          <>
            <li>
              <strong>New commenters:</strong> {newCommenters.commenters}
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default TodayTotals;
