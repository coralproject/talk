import { Localized } from "@fluent/react/compat";
import { useField } from "formik";
import React, { FunctionComponent } from "react";

import { GQLUSER_ROLE } from "coral-framework/schema";

import styles from "./StaffRoles.css";

const StaffRoles: FunctionComponent<{}> = () => {
  const [, meta] = useField("role");
  switch (meta.value) {
    case GQLUSER_ROLE.STAFF:
      return (
        <Localized id="community-invite-role-staff" strong={<strong />}>
          <div className={styles.bodyText}>
            Staff role: Receives a “Staff” badge, and comments are automatically
            approved. Cannot moderate or change any Coral configuration.
          </div>
        </Localized>
      );
    case GQLUSER_ROLE.MODERATOR:
      return (
        <Localized id="community-invite-role-moderator" strong={<strong />}>
          <div className={styles.bodyText}>
            Moderator role: Receives a “Staff” badge, and comments are
            automatically approved. Has full moderation privileges (approve,
            reject and feature comments). Can configure individual articles but
            no site-wide configuration privileges.
          </div>
        </Localized>
      );
    case GQLUSER_ROLE.ADMIN:
      return (
        <Localized id="community-invite-role-admin" strong={<strong />}>
          <div className={styles.bodyText}>
            Admin role: Receives a “Staff” badge, and comments are automatically
            approved. Has full moderation privileges (approve, reject and
            feature comments). Can configure individual articles and has
            site-wide configuration privileges.
          </div>
        </Localized>
      );
    default:
      return null;
  }
};

export default StaffRoles;
