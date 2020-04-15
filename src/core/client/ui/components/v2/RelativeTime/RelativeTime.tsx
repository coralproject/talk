import cn from "classnames";
import React, { Ref } from "react";
import TimeAgo, { Formatter } from "react-timeago";

import { UIContext } from "coral-ui/components/v2";
import { withForwardRef, withStyles } from "coral-ui/hocs";
import { PropTypesOf } from "coral-ui/types";

import styles from "./RelativeTime.css";

interface Props {
  date: string;
  live?: boolean;
  classes: typeof styles;
  className?: string;
  formatter?: Formatter;

  /** Internal: Forwarded Ref */
  forwardRef?: Ref<HTMLDivElement>;
}

const defaultFormatter: Formatter = (value, unit, suffix, timestamp: string) =>
  new Date(timestamp).toISOString();

const RelativeTime: React.FunctionComponent<Props> = (props) => {
  const { date, classes, live, className, formatter } = props;
  return (
    <UIContext.Consumer>
      {({ timeagoFormatter }) => (
        <TimeAgo
          date={date}
          className={cn(classes.root, className)}
          live={live}
          formatter={timeagoFormatter || formatter || defaultFormatter}
        />
      )}
    </UIContext.Consumer>
  );
};

const enhanced = withForwardRef(withStyles(styles)(RelativeTime));
export type RelativeTimeProps = PropTypesOf<typeof enhanced>;
export default enhanced;
