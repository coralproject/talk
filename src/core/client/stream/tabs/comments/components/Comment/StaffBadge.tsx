import React from "react";
import { StatelessComponent } from "react";

import { Localized } from "fluent-react/compat";
import { Badge } from "talk-ui/components";

const StaffBadge: StatelessComponent = props => {
  return (
    <Localized id="comments-staffBadge">
      <Badge>Staff</Badge>
    </Localized>
  );
};

export default StaffBadge;
