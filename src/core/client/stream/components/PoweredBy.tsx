import cn from "classnames";
import React, { StatelessComponent } from "react";
import { Typography } from "talk-ui/components";

interface Props {
  className: string;
}

const PoweredBy: StatelessComponent<Props> = props => {
  return (
    <div className={cn(props.className)}>
      <Typography
        variant="inputDescription"
        container="span"
        color="textSecondary"
      >
        Powered by
      </Typography>{" "}
      <Typography variant="heading4" container="span">
        The Coral Project
      </Typography>
    </div>
  );
};

export default PoweredBy;
