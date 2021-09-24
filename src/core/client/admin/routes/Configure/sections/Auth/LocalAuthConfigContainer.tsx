import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { GQLFEATURE_FLAG } from "coral-framework/schema";
import { Icon } from "coral-ui/components/v2";
import { CallOut } from "coral-ui/components/v3";

import { LocalAuthConfigContainer_settings } from "coral-admin/__generated__/LocalAuthConfigContainer_settings.graphql";

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
  settings: LocalAuthConfigContainer_settings;
}

const LocalAuthConfigContainer: FunctionComponent<Props> = ({
  disabled,
  settings,
}) => {
  const forceAdminLocalAuth = settings.featureFlags.includes(
    GQLFEATURE_FLAG.FORCE_ADMIN_LOCAL_AUTH
  );

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

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment LocalAuthConfigContainer_settings on Settings {
      featureFlags
    }
  `,
})(LocalAuthConfigContainer);

export default enhanced;
