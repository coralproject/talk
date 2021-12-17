import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "relay-runtime";

import { TodayMetricsJSON } from "coral-common/types/dashboard";
import { useLocal } from "coral-framework/lib/relay";
import { useImmediateFetch } from "coral-framework/lib/relay/fetch";
import { Flex } from "coral-ui/components/v2";

import {
  TodayCompareValue,
  TodayDashboardBox,
  TodayValue,
} from "../components";
import createDashboardFetch from "../createDashboardFetch";

import { Today_local } from "coral-admin/__generated__/Today_local.graphql";

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
  lastUpdated: string;
}

const TodayTotals: FunctionComponent<Props> = ({ siteID, lastUpdated }) => {
  const [{ autoArchivingEnabled, autoArchivingThreshold }] = useLocal<
    Today_local
  >(graphql`
    fragment Today_local on Local {
      autoArchivingEnabled
      autoArchivingThreshold
    }
  `);
  const [today, loading] = useImmediateFetch(
    TodayMetricsFetch,
    { siteID },
    lastUpdated
  );
  const [total, totalLoading] = useImmediateFetch(
    TotalMetricsFetch,
    { siteID },
    lastUpdated
  );

  return (
    <div>
      <Localized id="dashboard-today-heading">
        <h3 className={styles.heading}>Today's activity</h3>
      </Localized>
      <Flex justifyContent="space-between" spacing={3}>
        <TodayDashboardBox icon="forum" loading={loading || totalLoading}>
          <TodayValue value={today?.comments.total.toString()}>
            <Localized id="dashboard-today-new-comments">
              New comments
            </Localized>
          </TodayValue>
          <TodayCompareValue value={total?.comments.total.toString()}>
            {autoArchivingEnabled ? (
              <Localized id="dashboard-archived-new-comments">
                <>{autoArchivingThreshold} total</> {/* TODO: format */}
              </Localized>
            ) : (
              <Localized id="dashboard-alltime-new-comments">
                All time total
              </Localized>
            )}
          </TodayCompareValue>
        </TodayDashboardBox>
        <TodayDashboardBox icon="close" loading={loading || totalLoading}>
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
            {autoArchivingEnabled ? (
              <Localized id="dashboard-archived-rejections">
                <>{autoArchivingThreshold} average</> {/* TODO: format */}
              </Localized>
            ) : (
              <Localized id="dashboard-alltime-rejections">
                All time average
              </Localized>
            )}
          </TodayCompareValue>
        </TodayDashboardBox>
        <TodayDashboardBox
          icon="recent_actors"
          loading={loading || totalLoading}
        >
          <TodayValue value={today?.comments.staff.toString()}>
            <Localized id="dashboard-today-staff-comments">
              Staff comments
            </Localized>
          </TodayValue>
          <TodayCompareValue value={total?.comments.staff.toString()}>
            {autoArchivingEnabled ? (
              <Localized id="dashboard-archived-staff-comments">
                <>{autoArchivingThreshold} total</> {/* TODO: format */}
              </Localized>
            ) : (
              <Localized id="dashboard-alltime-staff-comments">
                All time total
              </Localized>
            )}
          </TodayCompareValue>
        </TodayDashboardBox>
        <TodayDashboardBox icon="person_add" loading={loading || totalLoading}>
          <TodayValue value={today?.users.total.toString()}>
            <Localized id="dashboard-today-signups">
              New community members
            </Localized>
          </TodayValue>
          <TodayCompareValue value={total?.users.total.toString()}>
            <Localized id="dashboard-alltime-signups">Total members</Localized>
          </TodayCompareValue>
        </TodayDashboardBox>
        <TodayDashboardBox icon="block" loading={loading || totalLoading}>
          <TodayValue value={today?.users.bans.toString()}>
            <Localized id="dashboard-today-bans">Banned members</Localized>
          </TodayValue>
          <TodayCompareValue value={total?.users.bans.toString()}>
            <Localized id="dashboard-alltime-bans">
              Total banned members
            </Localized>
          </TodayCompareValue>
        </TodayDashboardBox>
      </Flex>
    </div>
  );
};

export default TodayTotals;
