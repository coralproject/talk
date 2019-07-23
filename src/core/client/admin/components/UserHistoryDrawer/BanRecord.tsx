import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import { TableCell, TableRow } from "coral-ui/components";

import styles from "./AccountHistoryRecord.css";

interface Props {
  createdAt: Date;
  createdBy: string | null | undefined;
  active: boolean;
}

const BanRecord: FunctionComponent<Props> = ({
  createdAt,
  active,
  createdBy,
}) => {
  let action: any = null;
  if (active) {
    action = (
      <Localized id={"moderate-user-drawer-account-history-banned"}>
        Banned
      </Localized>
    );
  } else {
    action = (
      <Localized id={"moderate-user-drawer-account-history-ban-removed"}>
        Ban removed
      </Localized>
    );
  }

  return (
    <TableRow className={styles.row}>
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

export default BanRecord;
