import { Localized } from "@fluent/react/compat";
import { isNumber } from "lodash";
import React, { FunctionComponent, useEffect, useState } from "react";
import { Environment } from "relay-runtime";

import {
  CommentsCountJSON,
  RejectedJSON,
  UserBanStatusJSON,
} from "coral-common/rest/dashboard/types";
import { createFetch, useFetch } from "coral-framework/lib/relay";
import { Table, TableBody, TableCell, TableRow } from "coral-ui/components/v2";

import styles from "./TodayTotals.css";

const AllTimeTotalsFetch = createFetch(
  "allTimeTotalsFetch",
  async (environment: Environment, variables: any, { rest }) => {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const url = `/dashboard/${
      variables.siteID ? variables.siteID + "/" : ""
    }/comments/all?tz=${zone}`;
    return rest.fetch<CommentsCountJSON>(url, {
      method: "GET",
    });
  }
);

const UserBanStatusFetch = createFetch(
  "userBanStatusFetch",
  async (environment: Environment, variables: any, { rest }) => {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const url = `/dashboard/${
      variables.siteID ? variables.siteID + "/" : ""
    }user_ban_status?tz=${zone}`;
    return rest.fetch<UserBanStatusJSON>(url, {
      method: "GET",
    });
  }
);

const AllTimeRejectedFetch = createFetch(
  "AllTimeRejectedFetch",
  async (environment: Environment, variables: any, { rest }) => {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const url = `/dashboard/${
      variables.siteID ? variables.siteID + "/" : ""
    }rejected/all?tz=${zone}`;
    return rest.fetch<RejectedJSON>(url, {
      method: "GET",
    });
  }
);

interface Props {
  ssoRegistrationEnabled: boolean;
  siteID?: string;
}

const AllTimeTotals: FunctionComponent<Props> = (props) => {
  const allTimeTotalsFetch = useFetch(AllTimeTotalsFetch);
  const userBanStatusFetch = useFetch(UserBanStatusFetch);
  const rejectedFetch = useFetch(AllTimeRejectedFetch);
  const [totalComents, setTotalComments] = useState<number | null>(null);
  const [bans, setBans] = useState<number | null>(null);
  const [users, setUsers] = useState<number | null>(null);
  const [rejected, setRejected] = useState<number | null>(null);
  const [totalStaffComents, setTotalStaffComments] = useState<number | null>(
    null
  );
  useEffect(() => {
    async function getTotals() {
      const allTimeTotals = await allTimeTotalsFetch({ siteID: props.siteID });
      setTotalComments(allTimeTotals.comments.count);
      setTotalStaffComments(allTimeTotals.comments.byAuthorRole.staff.count);
      const bansResp = await userBanStatusFetch({ siteID: props.siteID });
      setBans(bansResp.users.banned.count);
      setUsers(bansResp.users.count);
      const rejectedResp = await rejectedFetch({ siteID: props.siteID });
      setRejected(rejectedResp.rejected.count);
    }
    getTotals();
  }, []);
  return (
    <div>
      <Localized id="dashboard-today-heading">
        <h3 className={styles.heading}>All Time</h3>
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
          {isNumber(users) && (
            <TableRow>
              <Localized id="dashboard-today-table-new-commenters">
                <TableCell>Commenters</TableCell>
              </Localized>
              <TableCell>{users}</TableCell>
            </TableRow>
          )}
          {isNumber(bans) && (
            <TableRow>
              <Localized id="dashboard-today-table-new-commenters">
                <TableCell>User bans</TableCell>
              </Localized>
              <TableCell>{bans}</TableCell>
            </TableRow>
          )}
          {isNumber(rejected) && (
            <TableRow>
              <Localized id="dashboard-today-table-new-commenters">
                <TableCell>Rejected comments</TableCell>
              </Localized>
              <TableCell>{rejected}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AllTimeTotals;
