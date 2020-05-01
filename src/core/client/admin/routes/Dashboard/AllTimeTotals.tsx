import { Localized } from "@fluent/react/compat";
import { isNumber } from "lodash";
import React, { FunctionComponent, useEffect, useState } from "react";

import { CountersJSON } from "coral-common/rest/dashboard/types";
import { useFetch } from "coral-framework/lib/relay";
import { Table, TableBody, TableCell, TableRow } from "coral-ui/components/v2";

import createDashboardFetch from "./createDashboardFetch";

import styles from "./AllTimeTotals.css";

const AllTimeTotalsFetch = createDashboardFetch<CountersJSON>(
  "allTimeTotalsFetch",
  "/dashboard/all-time"
);

interface Props {
  ssoRegistrationEnabled: boolean;
  siteID?: string;
}

const AllTimeTotals: FunctionComponent<Props> = (props) => {
  const allTimeTotalsFetch = useFetch(AllTimeTotalsFetch);
  const [allTimeTotals, setallTimeTotals] = useState<
    CountersJSON["counts"] | null
  >(null);
  useEffect(() => {
    async function getTotals() {
      const { counts } = await allTimeTotalsFetch({ siteID: props.siteID });
      setallTimeTotals(counts);
    }
    getTotals();
  }, []);
  return (
    <div>
      <Localized id="dashboard-allTime-heading">
        <h3 className={styles.heading}>All-time</h3>
      </Localized>
      <Table>
        {allTimeTotals && (
          <TableBody>
            {isNumber(allTimeTotals.comments) && (
              <TableRow>
                <Localized id="dashboard-allTime-table-total-comments">
                  <TableCell>Total comments</TableCell>
                </Localized>
                <TableCell>{allTimeTotals.comments}</TableCell>
                <TableCell />
              </TableRow>
            )}
            {isNumber(allTimeTotals.rejections) &&
              isNumber(allTimeTotals.comments) && (
                <TableRow>
                  <Localized id="dashboard-allTime-table-rejections">
                    <TableCell>Rejected</TableCell>
                  </Localized>
                  <TableCell>{allTimeTotals.rejections}</TableCell>
                  <TableCell>
                    {(
                      (allTimeTotals.rejections / allTimeTotals.comments) *
                      100
                    ).toFixed(2)}{" "}
                    %
                  </TableCell>
                </TableRow>
              )}
            {isNumber(allTimeTotals.staffComments) && (
              <TableRow>
                <Localized id="dashboard-allTime-table-staffComments">
                  <TableCell>Staff comments</TableCell>
                </Localized>
                <TableCell>{allTimeTotals.staffComments}</TableCell>
                <TableCell />
              </TableRow>
            )}
            {props.ssoRegistrationEnabled && isNumber(allTimeTotals.signups) && (
              <TableRow>
                <Localized id="dashboard-allTime-table-signups">
                  <TableCell>Registrations</TableCell>
                </Localized>
                <TableCell>{allTimeTotals.signups}</TableCell>
                <TableCell />
              </TableRow>
            )}
            {isNumber(allTimeTotals.bans) && (
              <TableRow>
                <Localized id="dashboard-allTime-table-bans">
                  <TableCell>Banned commenters</TableCell>
                </Localized>
                <TableCell>{allTimeTotals.bans}</TableCell>
                <TableCell />
              </TableRow>
            )}
          </TableBody>
        )}
      </Table>
    </div>
  );
};

export default AllTimeTotals;
