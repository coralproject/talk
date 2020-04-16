// import { Localized } from "@fluent/react/compat";
import { isNumber } from "lodash";
import React, { FunctionComponent, useEffect, useState } from "react";
import { Environment } from "relay-runtime";

import {
  DailyCommentsJSON,
  DailyNewCommentersJSON,
} from "coral-common/rest/dashboard/types";
import { createFetch, useFetch } from "coral-framework/lib/relay";
import {} from "coral-ui/components/v2";

const TodayTotalsFetch = createFetch(
  "todayTotalsFetch",
  async (environment: Environment, variables: any, { rest }) =>
    await rest.fetch<DailyCommentsJSON>("/dashboard/daily/comments", {
      method: "GET",
    })
);

const TodayNewCommentersFetch = createFetch(
  "newCommentersFetch",
  async (environment: Environment, variables: any, { rest }) =>
    await rest.fetch<DailyNewCommentersJSON>(
      "/dashboard/daily/new-commenters",
      {
        method: "GET",
      }
    )
);

const TodayTotals: FunctionComponent = () => {
  const todayTotalsFetch = useFetch(TodayTotalsFetch);
  const newComentersFetch = useFetch(TodayNewCommentersFetch);
  const [totalComents, setTotalComments] = useState<number | null>(null);
  const [totalStaffComents, setTotalStaffComments] = useState<number | null>(
    null
  );
  const [newCommenters, setNewCommenters] = useState<number | null>(null);
  useEffect(() => {
    async function getTotals() {
      const todayTotals = await todayTotalsFetch(null);
      setTotalComments(todayTotals.comments.count);
      setTotalStaffComments(todayTotals.comments.byAuthorRole.staff.count);
      const newCommenterResp = await newComentersFetch(null);
      setNewCommenters(newCommenterResp.newCommenters.count);
    }
    getTotals();
  }, []);
  return (
    <div>
      <h3>Daily totals</h3>
      <ul>
        {isNumber(totalComents) && (
          <li>
            <strong>Total comments:</strong> {totalComents}
          </li>
        )}
        {isNumber(totalStaffComents) && (
          <li>
            <strong>Staff comments:</strong> {totalStaffComents}
          </li>
        )}
        {isNumber(newCommenters) && (
          <>
            <li>
              <strong>New commenters:</strong> {newCommenters}
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default TodayTotals;
