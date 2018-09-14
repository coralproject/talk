import cn from "classnames";
import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";
import { Typography } from "talk-ui/components";

interface Props {
  className: string;
}

const PoweredBy: StatelessComponent<Props> = props => {
  return (
    <div className={cn(props.className)}>
      <Localized
        id="comments-poweredBy"
        logo={<Typography variant="heading4" container="span" />}
      >
        <Typography variant="detail" container="span" color="textSecondary">
          {"Powered by <logo>The Coral Project</logo>"}
        </Typography>
      </Localized>
    </div>
  );
};

export default PoweredBy;
