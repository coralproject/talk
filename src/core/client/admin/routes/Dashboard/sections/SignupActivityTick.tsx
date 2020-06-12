import React, { FunctionComponent, useMemo } from "react";

import {
  CHART_COLOR_MONO_100,
  CHART_COLOR_MONO_500,
  CHART_COLOR_PRIMARY_DARK,
} from "./ChartColors";

interface TickPayload {
  value: string;
}

interface Props {
  x: number;
  locales: string[];
  y: number;
  payload: TickPayload;
  isToday: boolean;
}

const SignupActivityTick: FunctionComponent<Props> = ({
  x,
  y,
  payload,
  locales,
  isToday,
}) => {
  const date = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(locales, {
      day: "numeric",
      month: "numeric",
    });
    return formatter.format(new Date(payload.value));
  }, [payload.value]);
  const dayOfWeek = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(locales, {
      weekday: "short",
    });
    return formatter.format(new Date(payload.value));
  }, [payload.value]);
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={12}
        fill={isToday ? CHART_COLOR_PRIMARY_DARK : CHART_COLOR_MONO_500}
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
        fill={isToday ? CHART_COLOR_PRIMARY_DARK : CHART_COLOR_MONO_100}
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
