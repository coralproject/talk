import cn from "classnames";
import { Typography } from "coral-ui/components";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

interface Props {
  className: string;
}

const PoweredBy: FunctionComponent<Props> = props => {
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
