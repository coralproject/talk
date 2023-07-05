import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useMemo } from "react";
import { TooltipProps } from "recharts";

import { useDateTimeFormatter } from "coral-framework/hooks";

import styles from "./CommentActivityTooltip.css";

type Props = TooltipProps<any, any>;

const CommentActivityTooltip: FunctionComponent<Props> = ({
  active,
  payload,
  label,
}) => {
  const formatter = useDateTimeFormatter({
    hour: "2-digit",
    minute: "2-digit",
  });
  const formattedLabel = useMemo(() => {
    if (label) {
      return formatter(label).toLowerCase();
    }
    return "";
  }, [label, formatter]);
  if (active) {
    return (
      <div className={styles.root}>
        <p className={styles.time}>{formattedLabel}</p>
        {payload && <p className={styles.count}>{payload[0].value}</p>}
        <Localized id="dashboard-comment-activity-tooltip-comments">
          <p className={styles.comments}>Comments</p>
        </Localized>
      </div>
    );
  }
  return null;
};

export default CommentActivityTooltip;
