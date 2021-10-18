import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { useLocal } from "coral-framework/lib/relay";
import { Icon } from "coral-ui/components/v2";
import { CallOut } from "coral-ui/components/v3";

import { LocalAuthConfigContainerLocal } from "coral-admin/__generated__/LocalAuthConfigContainerLocal.graphql";

import Header from "../../Header";
import ConfigBoxWithToggleField from "./ConfigBoxWithToggleField";
import RegistrationField from "./RegistrationField";
import TargetFilterField from "./TargetFilterField";

import styles from "./LocalAuthConfigContainer.css";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment LocalAuthConfigContainer_formValues on Auth {
    integrations {
      local {
        enabled
        allowRegistration
        targetFilter {
          admin
          stream
        }
      }
    }
  }
`;

interface Props {
  disabled?: boolean;
}

const LocalAuthConfigContainer: FunctionComponent<Props> = ({ disabled }) => {
  const [{ forceAdminLocalAuth }] = useLocal<
    LocalAuthConfigContainerLocal
  >(graphql`
    fragment LocalAuthConfigContainerLocal on Local {
      forceAdminLocalAuth
    }
  `);

  return (
    <ConfigBoxWithToggleField
      title={
        <Localized id="configure-auth-local-loginWith">
          <Header container="h2">Login with email authentication</Header>
        </Localized>
      }
      name="auth.integrations.local.enabled"
      disabled={disabled}
      data-testid="configure-auth-local"
      forced={forceAdminLocalAuth}
    >
      {(disabledInside) => (
        <>
          <TargetFilterField
            label={
              <Localized id="configure-auth-local-useLoginOn">
                <span>Use email authentication login on</span>
              </Localized>
            }
            name="auth.integrations.local.targetFilter"
            disabled={disabledInside}
            forceAdmin={forceAdminLocalAuth}
          />
          {forceAdminLocalAuth && (
            <CallOut
              icon={<Icon className={styles.icon}>info</Icon>}
              color="warning"
            >
              <Localized id="configure-auth-local-forceAdminLocalAuth">
                Admin local auth has been permanently enabled. This is to ensure
                that Coral service teams can access the administration panel.
              </Localized>
            </CallOut>
          )}
          <RegistrationField
            name="auth.integrations.local.allowRegistration"
            disabled={disabledInside}
          />
        </>
      )}
    </ConfigBoxWithToggleField>
  );
};

export default LocalAuthConfigContainer;
