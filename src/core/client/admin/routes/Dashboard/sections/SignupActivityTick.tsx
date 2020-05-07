import React, { FunctionComponent, useMemo } from "react";

import { CHART_COLOR_MONO_100, CHART_COLOR_MONO_500 } from "./ChartColors";

interface TickPayload {
  value: string;
}

interface Props {
  x: number;
  locales: string[];
  y: number;
  payload: TickPayload;
}

const SignupActivityTick: FunctionComponent<Props> = ({
  x,
  y,
  payload,
  locales,
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
        fill={CHART_COLOR_MONO_500}
        fontSize={12}
        fontWeight={600}
        textAnchor="middle"
      >
        {date}
      </text>
      <text
        x={0}
        y={0}
        dy={28}
        fill={CHART_COLOR_MONO_100}
        fontSize={12}
        textAnchor="middle"
      >
        {dayOfWeek}
      </text>
    </g>
  );
};

export default SignupActivityTick;
