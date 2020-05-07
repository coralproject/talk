import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useEffect, useState } from "react";

import { CountersJSON } from "coral-common/rest/dashboard/types";
import { useFetch } from "coral-framework/lib/relay";
import { Flex } from "coral-ui/components/v2";

import {
  TodayCompareValue,
  TodayDashboardBox,
  TodayValue,
} from "../components";
import createDashboardFetch from "../createDashboardFetch";

import styles from "./Today.css";

const TodayTotalsFetch = createDashboardFetch<CountersJSON>(
  "todayTotalsFetch",
  "/dashboard/today"
);

const AllTimeTotalsFetch = createDashboardFetch<CountersJSON>(
  "allTimeTotalsFetch",
  "/dashboard/all-time"
);

interface Props {
  ssoRegistrationEnabled: boolean;
  siteID?: string;
}

const TodayTotals: FunctionComponent<Props> = (props) => {
  const todayTotalsFetch = useFetch(TodayTotalsFetch);
  const allTimeTotalsFetch = useFetch(AllTimeTotalsFetch);
  const [todayTotals, setTodayTotals] = useState<CountersJSON["counts"] | null>(
    null
  );
  const [allTimeTotals, setAllTimeTotals] = useState<
    CountersJSON["counts"] | null
  >(null);
  useEffect(() => {
    async function getTotals() {
      const { counts } = await todayTotalsFetch({ siteID: props.siteID });
      setTodayTotals(counts);
      const { counts: allTimeCounts } = await allTimeTotalsFetch({
        siteID: props.siteID,
      });
      setAllTimeTotals(allTimeCounts);
    }
    getTotals();
  }, []);
  return (
    <div>
      <Localized id="dashboard-today-heading">
        <h3 className={styles.heading}>Today's activity</h3>
      </Localized>
      <Flex justifyContent="space-between" spacing={3}>
        <TodayDashboardBox icon="forum">
          {todayTotals && (
            <TodayValue value={todayTotals.comments.toString()}>
              <Localized id="dashboard-today-new-comments">
                New comments
              </Localized>
            </TodayValue>
          )}
          {allTimeTotals && (
            <TodayCompareValue value={allTimeTotals.comments.toString()}>
              <Localized id="dashboard-today-alltime-comments">
                All time total
              </Localized>
            </TodayCompareValue>
          )}
        </TodayDashboardBox>
        <TodayDashboardBox icon="close">
          {todayTotals && (
            <TodayValue
              value={`${(todayTotals.comments > 0
                ? (todayTotals.rejections / todayTotals.comments) * 100
                : 0
              ).toFixed(2)} %`}
            >
              <Localized id="dashboard-today-rejections">
                Rejection rate
              </Localized>
            </TodayValue>
          )}
          {allTimeTotals && (
            <TodayCompareValue
              value={`${(allTimeTotals.comments > 0
                ? (allTimeTotals.rejections / allTimeTotals.comments) * 100
                : 0
              ).toFixed(2)} %`}
            >
              <Localized id="dashboard-today-alltime-rejection">
                All time average
              </Localized>
            </TodayCompareValue>
          )}
        </TodayDashboardBox>
        <TodayDashboardBox icon="badge">
          {todayTotals && (
            <TodayValue value={todayTotals.staffComments.toString()}>
              <Localized id="dashboard-today-staff-comments">
                Staff comments
              </Localized>
            </TodayValue>
          )}
          {allTimeTotals && (
            <TodayCompareValue value={allTimeTotals.staffComments.toString()}>
              <Localized id="dashboard-today-alltime-staff-comments">
                All time total
              </Localized>
            </TodayCompareValue>
          )}
        </TodayDashboardBox>
        <TodayDashboardBox icon="person_add">
          {todayTotals && (
            <TodayValue value={todayTotals.signups.toString()}>
              <Localized id="dashboard-today-signups">New accounts</Localized>
            </TodayValue>
          )}
          {allTimeTotals && (
            <TodayCompareValue value={allTimeTotals.signups.toString()}>
              <Localized id="dashboard-today-alltime-signups">
                Total accounts
              </Localized>
            </TodayCompareValue>
          )}
        </TodayDashboardBox>
        <TodayDashboardBox icon="block">
          {todayTotals && (
            <TodayValue value={todayTotals.bans.toString()}>
              <Localized id="dashboard-today-bans">Account bans</Localized>
            </TodayValue>
          )}
          {allTimeTotals && (
            <TodayCompareValue value={allTimeTotals.bans.toString()}>
              <Localized id="dashboard-today-alltime-bans">
                Total account bans
              </Localized>
            </TodayCompareValue>
          )}
        </TodayDashboardBox>
      </Flex>
    </div>
  );
};

export default TodayTotals;
