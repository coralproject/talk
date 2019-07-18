import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import { TableCell, TableRow } from "coral-ui/components";

interface From {
  start: any;
  finish: any;
}

interface Props {
  createdAt: Date;
  createdBy: string | null | undefined;
  active: boolean;
  from: From;
}

const SuspensionRecord: FunctionComponent<Props> = ({
  createdAt,
  active,
  from,
  createdBy,
}) => {
  let action: any = null;
  if (active) {
    const startDate = new Date(from.start);
    const endDate = new Date(from.finish);
    const diffSeconds = (endDate.getTime() - startDate.getTime()) / 1000;

    action = (
      <div>
        <Localized id={"moderate-user-drawer-account-history-suspension-time"}>
          Suspension
        </Localized>
        <div>{` ${diffSeconds}s`}</div>
      </div>
    );
  } else {
    action = (
      <Localized id={"moderate-user-drawer-account-history-suspension-removed"}>
        Suspension Removed
      </Localized>
    );
  }

  return (
    <TableRow>
      <TableCell>
        {createdAt.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </TableCell>
      <TableCell>{action}</TableCell>
      <TableCell>{createdBy}</TableCell>
    </TableRow>
  );
};

export default SuspensionRecord;
