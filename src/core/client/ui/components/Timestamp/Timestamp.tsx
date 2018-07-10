import cn from "classnames";
import React from "react";
import TimeAgo, { Formatter } from "react-timeago";

import { UIContext } from "talk-ui/components";
import { withStyles } from "talk-ui/hocs";
import { PropTypesOf } from "talk-ui/types";

import * as styles from "./Timestamp.css";

interface InnerProps {
  date: string;
  live?: boolean;
  classes: typeof styles;
  className?: string;
}

const defaultFormatter: Formatter = (value, unit, suffix, timestamp: string) =>
  new Date(timestamp).toISOString();

class Timestamp extends React.Component<InnerProps> {
  public render() {
    const { date, classes, live, className } = this.props;
    return (
      <UIContext.Consumer>
        {({ timeagoFormatter }) => (
          <TimeAgo
            date={date}
            className={cn(className, classes.root)}
            live={live}
            formatter={timeagoFormatter || defaultFormatter}
          />
        )}
      </UIContext.Consumer>
    );
  }
}

const enhanced = withStyles(styles)(Timestamp);
export type TimestampProps = PropTypesOf<typeof enhanced>;
export default enhanced;
