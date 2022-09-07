import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import { reduceSeconds } from "coral-common/helpers/i18n";
import TIME from "coral-common/time";
import {
  Flex,
  HorizontalGutter,
  Tooltip,
  TooltipButton,
} from "coral-ui/components/v2";

import styles from "./RecentHistory.css";

interface Props {
  triggered: boolean;
  timeFrame: number;
  rejectionRate: number;
  submitted: number;
}

const RecentHistory: FunctionComponent<Props> = ({
  triggered,
  timeFrame,
  rejectionRate,
  submitted,
}) => {
  const { scaled, unit } = reduceSeconds(timeFrame, [TIME.DAY]);

  return (
    <HorizontalGutter spacing={2}>
      <div>
        <Localized id="moderate-user-drawer-recent-history-title">
          <h3 className={styles.title}>Recent comment history</h3>
        </Localized>
        <Localized
          id="moderate-user-drawer-recent-history-calculated"
          vars={{ unit, value: scaled }}
        >
          <p className={styles.subTitle}>
            Calculated over the last {scaled} {unit}
          </p>
        </Localized>
      </div>
      <Flex spacing={3}>
        <div>
          <p
            className={cn(styles.amount, {
              [styles.triggered]: triggered,
            })}
          >
            {Math.round(rejectionRate * 100)}%
          </p>
          <Flex>
            <Localized id="moderate-user-drawer-recent-history-rejected">
              <span
                className={cn(styles.amountLabel, {
                  [styles.triggered]: triggered,
                })}
              >
                Rejected
              </span>
            </Localized>
            <Tooltip
              id="recentCommentHistory-rejectionPopover"
              title={
                <Localized id="moderate-user-drawer-recent-history-tooltip-title">
                  <span>How is this calculated?</span>
                </Localized>
              }
              body={
                <Localized id="moderate-user-drawer-recent-history-tooltip-body">
                  <span>
                    Rejected comments divided by the sum of rejected and
                    published comments, during the recent comment history time
                    frame.
                  </span>
                </Localized>
              }
              button={({ toggleVisibility, ref }) => (
                <Localized
                  id="moderate-user-drawer-recent-history-tooltip-button"
                  attrs={{ "aria-label": true }}
                >
                  <TooltipButton
                    className={styles.tooltip}
                    aria-label="Toggle recent comment history tooltip"
                    toggleVisibility={toggleVisibility}
                    ref={ref}
                  />
                </Localized>
              )}
            />
          </Flex>
        </div>
        <div>
          <p className={styles.amount}>{submitted}</p>
          <Localized id="moderate-user-drawer-recent-history-tooltip-submitted">
            <p className={styles.amountLabel}>Submitted</p>
          </Localized>
        </div>
      </Flex>
    </HorizontalGutter>
  );
};

export default RecentHistory;
