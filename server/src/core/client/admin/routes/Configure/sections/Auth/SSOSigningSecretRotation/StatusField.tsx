import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import { Flex, Icon, Tooltip, TooltipButton } from "coral-ui/components/v2";

import styles from "./StatusField.css";

export enum SSOSigningSecretStatus {
  EXPIRED,
  EXPIRING,
  ACTIVE,
}

interface Props {
  status: SSOSigningSecretStatus;
}

const StatusField: FunctionComponent<Props> = ({ status }) => {
  switch (status) {
    case SSOSigningSecretStatus.ACTIVE:
      return (
        <Localized id="configure-auth-sso-rotate-statusActive">
          <span
            className={cn(styles.status, styles.active)}
            data-testid="SSO-Key-Status"
          >
            Active
          </span>
        </Localized>
      );
    case SSOSigningSecretStatus.EXPIRING:
      return (
        <Flex alignItems="center" justifyContent="center">
          <Flex
            alignItems="center"
            justifyContent="center"
            className={cn(styles.status, styles.expiring)}
          >
            <Icon className={styles.icon}>alarm</Icon>
            <Localized id="configure-auth-sso-rotate-statusExpiring">
              <span data-testid="SSO-Key-Status">Expiring</span>
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
    case SSOSigningSecretStatus.EXPIRED:
      return (
        <Flex alignItems="center" justifyContent="center">
          <Localized id="configure-auth-sso-rotate-statusExpired">
            <span
              className={cn(styles.status, styles.expired)}
              data-testid="SSO-Key-Status"
            >
              Expired
            </span>
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
    default:
      return (
        <Localized id="configure-auth-sso-rotate-statusUnknown">
          <span data-testid="SSO-Key-Status">Unknown</span>
        </Localized>
      );
  }
};

export default StatusField;
