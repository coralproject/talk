import React, { FunctionComponent, useMemo } from "react";

import { useDateTimeFormatter } from "coral-framework/hooks";

import {
  CHART_COLOR_MONO_100,
  CHART_COLOR_MONO_500,
  CHART_COLOR_PRIMARY_700,
} from "./ChartColors";

interface TickPayload {
  value: string;
}

interface Props {
  x: number;
  y: number;
  payload: TickPayload;
  isToday: boolean;
}

const SignupActivityTick: FunctionComponent<Props> = ({
  x,
  y,
  payload,
  isToday,
}) => {
  const dateFormatter = useDateTimeFormatter({
    day: "numeric",
    month: "numeric",
  });
  const date = useMemo(
    () => dateFormatter(payload.value),
    [payload.value, dateFormatter]
  );
  const dayOfWeekFormatter = useDateTimeFormatter({
    weekday: "short",
  });
  const dayOfWeek = useMemo(
    () => dayOfWeekFormatter(payload.value),
    [dayOfWeekFormatter, payload.value]
  );
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={12}
        fill={isToday ? CHART_COLOR_PRIMARY_700 : CHART_COLOR_MONO_500}
        fontSize={12}
        fontWeight={isToday ? 700 : 600}
        textAnchor="middle"
      >
        {date}
      </text>
      <text
        x={0}
        y={0}
        dy={28}
        fill={isToday ? CHART_COLOR_PRIMARY_700 : CHART_COLOR_MONO_100}
        fontSize={12}
        fontWeight={isToday ? 700 : 500}
        textAnchor="middle"
      >
        {dayOfWeek}
      </text>
    </g>
  );
};

export default SignupActivityTick;
