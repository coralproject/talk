import React, { StatelessComponent } from "react";
import { Typography } from "talk-ui/components";

const PoweredBy: StatelessComponent = () => {
  return (
    <div>
      <Typography variant="inputDescription" container="span">
        Powered by
      </Typography>{" "}
      <Typography variant="heading4" container="span">
        The Coral Project
      </Typography>
    </div>
  );
};

export default PoweredBy;
