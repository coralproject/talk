import { Localized } from "@fluent/react/compat";
import { isNumber } from "lodash";
import React, { FunctionComponent, useEffect, useState } from "react";
import { Environment } from "relay-runtime";

import {
  DailyCommentsJSON,
  DailySignupsJSON,
} from "coral-common/rest/dashboard/types";
import { createFetch, useFetch } from "coral-framework/lib/relay";
import { Table, TableBody, TableCell, TableRow } from "coral-ui/components/v2";
import styles from "./TodayTotals.css";

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
    await rest.fetch<DailySignupsJSON>("/dashboard/daily/new-signups", {
      method: "GET",
    })
);

interface Props {
  ssoRegistrationEnabled: boolean;
}

const TodayTotals: FunctionComponent<Props> = props => {
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
      if (!props.ssoRegistrationEnabled) {
        const newCommenterResp = await newComentersFetch(null);
        setNewCommenters(newCommenterResp.signups.count);
      }
    }
    getTotals();
  }, []);
  return (
    <div>
      <Localized id="dashboard-today-heading">
        <h3 className={styles.heading}>Today</h3>
      </Localized>
      <Table>
        <TableBody>
          {isNumber(totalComents) && (
            <TableRow>
              <Localized id="dashboard-today-table-total-comments">
                <TableCell>Total comments</TableCell>
              </Localized>
              <TableCell>{totalComents}</TableCell>
            </TableRow>
          )}
          {isNumber(totalStaffComents) && (
            <TableRow>
              <Localized id="dashboard-today-table-total-staff-comments">
                <TableCell>Staff comments</TableCell>
              </Localized>
              <TableCell>{totalStaffComents}</TableCell>
            </TableRow>
          )}
          {isNumber(newCommenters) && (
            <TableRow>
              <Localized id="dashboard-today-table-new-commenters">
                <TableCell>New commenters</TableCell>
              </Localized>
              <TableCell>{newCommenters}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TodayTotals;
