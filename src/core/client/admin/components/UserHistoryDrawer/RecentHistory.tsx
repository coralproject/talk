import cn from "classnames";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import { reduceSeconds, UNIT } from "coral-common/helpers/i18n";
import {
  Box,
  Flex,
  Tooltip,
  TooltipButton,
  Typography,
} from "coral-ui/components";

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
  const { scaled, unit } = reduceSeconds(timeFrame, [UNIT.DAYS]);

  return (
    <Box mt={3}>
      <Localized id="moderate-user-drawer-recent-history-title">
        <Typography className={styles.title} variant="bodyCopyBold">
          Recent comment history
        </Typography>
      </Localized>
      <Localized
        id="moderate-user-drawer-recent-history-calculated"
        $unit={unit}
        $value={scaled}
      >
        <Typography className={styles.subTitle} variant="bodyCopy">
          Calculated over the last {scaled} {unit}
        </Typography>
      </Localized>
      <Box mt={1}>
        <Box className={styles.info} mr={4}>
          <Typography
            className={cn(styles.amount, {
              [styles.triggered]: triggered,
            })}
            variant="bodyCopyBold"
          >
            {Math.round(rejectionRate * 100)}%
          </Typography>
          <Flex alignItems="center">
            <Localized id="moderate-user-drawer-recent-history-rejected">
              <Typography
                className={cn(styles.amountLabel, {
                  [styles.triggered]: triggered,
                })}
                variant="bodyCopy"
                container="span"
              >
                Rejected
              </Typography>
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
        </Box>
        <Box className={styles.info}>
          <Typography className={styles.amount} variant="bodyCopyBold">
            {submitted}
          </Typography>
          <Localized id="moderate-user-drawer-recent-history-tooltip-submitted">
            <Typography className={styles.amountLabel} variant="bodyCopy">
              Submitted
            </Typography>
          </Localized>
        </Box>
      </Box>
    </Box>
  );
};

export default RecentHistory;
