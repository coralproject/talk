import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useMemo } from "react";
import { TooltipProps } from "recharts";

import styles from "./CommentActivityTooltip.css";

type Props = TooltipProps & {
  locales: string[];
};

const CommentActivityTooltip: FunctionComponent<Props> = ({
  active,
  payload,
  label,
  locales,
}) => {
  const formattedLabel = useMemo(() => {
    if (label) {
      const formatter = new Intl.DateTimeFormat(locales, {
        hour: "2-digit",
        minute: "2-digit",
      });
      return formatter.format(new Date(label)).toLowerCase();
    }
    return "";
  }, [label]);
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
