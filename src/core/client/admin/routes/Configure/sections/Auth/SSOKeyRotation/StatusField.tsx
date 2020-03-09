import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import { Flex, Icon, Tooltip, TooltipButton } from "coral-ui/components/v2";

import styles from "./StatusField.css";

export enum SSOKeyStatus {
  EXPIRED,
  EXPIRING,
  ACTIVE,
}

interface Props {
  status: SSOKeyStatus;
}

const StatusField: FunctionComponent<Props> = ({ status }) => {
  if (status === SSOKeyStatus.ACTIVE) {
    return (
      <Localized id="configure-auth-sso-rotate-statusActive">
        <span className={cn(styles.status, styles.active)}>Active</span>
      </Localized>
    );
  }
  if (status === SSOKeyStatus.EXPIRING) {
    return (
      <Flex alignItems="center" justifyContent="center">
        <Flex
          alignItems="center"
          justifyContent="center"
          className={cn(styles.status, styles.expiring)}
        >
          <Icon className={styles.icon}>alarm</Icon>
          <Localized id="configure-auth-sso-rotate-statusExpiring">
            <span>Expiring</span>
          </Localized>
        </Flex>
        <Tooltip
          id="configure-auth-sso-rotate-expiringTooltip"
          title=""
          body={
            <Localized id="configure-auth-sso-rotate-expiringTooltip">
              <span>
                An SSO key is expiring when it is scheduled for rotation.
              </span>
            </Localized>
          }
          button={({ toggleVisibility, ref, visible }) => (
            <Localized
              id="configure-auth-sso-rotate-expiringTooltip-toggleButton"
              attrs={{ "aria-label": true }}
            >
              <TooltipButton
                active
                aria-label="Toggle expiring tooltip visibility"
                toggleVisibility={toggleVisibility}
                ref={ref}
              />
            </Localized>
          )}
        />
      </Flex>
    );
  }
  if (status === SSOKeyStatus.EXPIRED) {
    return (
      <Flex alignItems="center" justifyContent="center">
        <Localized id="configure-auth-sso-rotate-statusExpired">
          <span className={cn(styles.status, styles.expired)}>Expired</span>
        </Localized>
        <Tooltip
          id="configure-auth-sso-rotate-expiredTooltip"
          title=""
          body={
            <Localized id="configure-auth-sso-rotate-expiredTooltip">
              <span>
                An SSO key is expired when it has been rotated out of use.
              </span>
            </Localized>
          }
          button={({ toggleVisibility, ref, visible }) => (
            <Localized
              id="configure-auth-sso-rotate-expiredTooltip-toggleButton"
              attrs={{ "aria-label": true }}
            >
              <TooltipButton
                active
                aria-label="Toggle expired tooltip visibility"
                toggleVisibility={toggleVisibility}
                ref={ref}
              />
            </Localized>
          )}
        />
      </Flex>
    );
  }

  return (
    <Localized id="configure-auth-sso-rotate-statusUnknown">
      <span>Unknown</span>
    </Localized>
  );
};

export default StatusField;
