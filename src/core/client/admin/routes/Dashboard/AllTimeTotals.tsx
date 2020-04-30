import { Localized } from "@fluent/react/compat";
import { isNumber } from "lodash";
import React, { FunctionComponent, useEffect, useState } from "react";

import {
  CommentsCountJSON,
  RejectedJSON,
  UserBanStatusJSON,
} from "coral-common/rest/dashboard/types";
import { useFetch } from "coral-framework/lib/relay";
import { Table, TableBody, TableCell, TableRow } from "coral-ui/components/v2";

import createDashboardFetch from "./createDashboardFetch";

import styles from "./TodayTotals.css";

const AllTimeTotalsFetch = createDashboardFetch<CommentsCountJSON>(
  "allTimeTotalsFetch",
  "/dashboard/comments/all"
);

const UserBanStatusFetch = createDashboardFetch<UserBanStatusJSON>(
  "userBanStatusFetch",
  "/dashboard/user_ban_status"
);

const AllTimeRejectedFetch = createDashboardFetch<RejectedJSON>(
  "allTimeRejectedFetch",
  "/dashboard/rejected/all"
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
