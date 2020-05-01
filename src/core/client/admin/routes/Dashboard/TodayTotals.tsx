import { Localized } from "@fluent/react/compat";
import { isNumber } from "lodash";
import React, { FunctionComponent, useEffect, useState } from "react";

import { CountersJSON } from "coral-common/rest/dashboard/types";
import { useFetch } from "coral-framework/lib/relay";
import { Table, TableBody, TableCell, TableRow } from "coral-ui/components/v2";

import createDashboardFetch from "./createDashboardFetch";

import styles from "./TodayTotals.css";

const TodayTotalsFetch = createDashboardFetch<CountersJSON>(
  "todayTotalsFetch",
  "/dashboard/today"
);

interface Props {
  ssoRegistrationEnabled: boolean;
  siteID?: string;
}

const TodayTotals: FunctionComponent<Props> = (props) => {
  const todayTotalsFetch = useFetch(TodayTotalsFetch);
  const [todayTotals, setTodayTotals] = useState<CountersJSON["counts"] | null>(
    null
  );
  useEffect(() => {
    async function getTotals() {
      const { counts } = await todayTotalsFetch({ siteID: props.siteID });
      setTodayTotals(counts);
    }
    getTotals();
  }, []);
  return (
    <div>
      <Localized id="dashboard-today-heading">
        <h3 className={styles.heading}>Today</h3>
      </Localized>
      <Table>
        {todayTotals && (
          <TableBody>
            {isNumber(todayTotals.comments) && (
              <TableRow>
                <Localized id="dashboard-today-table-total-comments">
                  <TableCell>Total comments</TableCell>
                </Localized>
                <TableCell>{todayTotals.comments}</TableCell>
                <TableCell />
              </TableRow>
            )}
            {isNumber(todayTotals.rejections) &&
              isNumber(todayTotals.comments) && (
                <TableRow>
                  <Localized id="dashboard-today-table-rejections">
                    <TableCell>Rejected</TableCell>
                  </Localized>
                  <TableCell>{todayTotals.rejections}</TableCell>
                  <TableCell>
                    {todayTotals.comments > 0
                      ? (
                          (todayTotals.rejections / todayTotals.comments) *
                          100
                        ).toFixed(2)
                      : 0}
                    %
                  </TableCell>
                </TableRow>
              )}
            {isNumber(todayTotals.staffComments) && (
              <TableRow>
                <Localized id="dashboard-today-table-staffComments">
                  <TableCell>Staff comments</TableCell>
                </Localized>
                <TableCell>{todayTotals.staffComments}</TableCell>
                <TableCell />
              </TableRow>
            )}
            {props.ssoRegistrationEnabled && isNumber(todayTotals.signups) && (
              <TableRow>
                <Localized id="dashboard-today-table-signups">
                  <TableCell>Registrations</TableCell>
                </Localized>
                <TableCell>{todayTotals.signups}</TableCell>
                <TableCell />
              </TableRow>
            )}
            {isNumber(todayTotals.bans) && (
              <TableRow>
                <Localized id="dashboard-today-table-bans">
                  <TableCell>Banned commenters</TableCell>
                </Localized>
                <TableCell>{todayTotals.bans}</TableCell>
                <TableCell />
              </TableRow>
            )}
          </TableBody>
        )}
      </Table>
    </div>
  );
};

export default TodayTotals;
