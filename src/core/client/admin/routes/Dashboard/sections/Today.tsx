import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { TodayMetricsJSON } from "coral-common/rest/dashboard/types";
import { useImmediateFetch } from "coral-framework/lib/relay/fetch";
import { Flex } from "coral-ui/components/v2";

import {
  TodayCompareValue,
  TodayDashboardBox,
  TodayValue,
} from "../components";
import createDashboardFetch from "../createDashboardFetch";

import styles from "./Today.css";

const TodayMetricsFetch = createDashboardFetch<TodayMetricsJSON>(
  "todayMetricsFetch",
  "/dashboard/today"
);

const TotalMetricsFetch = createDashboardFetch<TodayMetricsJSON>(
  "totalMetricsFetch",
  "/dashboard/total"
);

interface Props {
  siteID: string;
}

const TodayTotals: FunctionComponent<Props> = ({ siteID }) => {
  const today = useImmediateFetch(TodayMetricsFetch, { siteID });
  const total = useImmediateFetch(TotalMetricsFetch, { siteID });

  return (
    <div>
      <Localized id="dashboard-today-heading">
        <h3 className={styles.heading}>Today's activity</h3>
      </Localized>
      <Flex justifyContent="space-between" spacing={3}>
        <TodayDashboardBox icon="forum">
          <TodayValue value={today?.comments.total.toString()}>
            <Localized id="dashboard-today-new-comments">
              New comments
            </Localized>
          </TodayValue>
          <TodayCompareValue value={total?.comments.total.toString()}>
            <Localized id="dashboard-alltime-new-comments">
              All time total
            </Localized>
          </TodayCompareValue>
        </TodayDashboardBox>
        <TodayDashboardBox icon="close">
          <TodayValue
            value={
              today
                ? `${(today.comments.total > 0
                    ? (today.comments.rejected / today.comments.total) * 100
                    : 0
                  ).toFixed(2)} %`
                : "-.-- %"
            }
          >
            <Localized id="dashboard-today-rejections">
              Rejection rate
            </Localized>
          </TodayValue>
          <TodayCompareValue
            value={
              total
                ? `${(total.comments.total > 0
                    ? (total.comments.rejected / total.comments.total) * 100
                    : 0
                  ).toFixed(2)} %`
                : "-.-- %"
            }
          >
            <Localized id="dashboard-alltime-rejections">
              All time average
            </Localized>
          </TodayCompareValue>
        </TodayDashboardBox>
        <TodayDashboardBox icon="badge">
          <TodayValue value={today?.comments.staff.toString()}>
            <Localized id="dashboard-today-staff-comments">
              Staff comments
            </Localized>
          </TodayValue>
          <TodayCompareValue value={total?.comments.staff.toString()}>
            <Localized id="dashboard-alltime-staff-comments">
              All time total
            </Localized>
          </TodayCompareValue>
        </TodayDashboardBox>
        <TodayDashboardBox icon="person_add">
          <TodayValue value={today?.users.total.toString()}>
            <Localized id="dashboard-today-signups">New accounts</Localized>
          </TodayValue>
          <TodayCompareValue value={total?.users.total.toString()}>
            <Localized id="dashboard-alltime-signups">Total accounts</Localized>
          </TodayCompareValue>
        </TodayDashboardBox>
        <TodayDashboardBox icon="block">
          <TodayValue value={today?.users.bans.toString()}>
            <Localized id="dashboard-today-bans">Account bans</Localized>
          </TodayValue>
          <TodayCompareValue value={total?.users.bans.toString()}>
            <Localized id="dashboard-alltime-bans">
              Total account bans
            </Localized>
          </TodayCompareValue>
        </TodayDashboardBox>
      </Flex>
    </div>
  );
};

export default TodayTotals;
