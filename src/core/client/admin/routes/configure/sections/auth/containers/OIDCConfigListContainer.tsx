import { cloneDeep } from "lodash";
import React from "react";
import { graphql } from "react-relay";

import { OIDCConfigListContainer_auth as AuthData } from "talk-admin/__generated__/OIDCConfigListContainer_auth.graphql";
import { OIDCConfigListContainer_authReadOnly as AuthReadOnlyData } from "talk-admin/__generated__/OIDCConfigListContainer_authReadOnly.graphql";
import {
  CreateOIDCAuthIntegrationMutation,
  UpdateOIDCAuthIntegrationMutation,
  withCreateOIDCAuthIntegrationMutation,
  withUpdateOIDCAuthIntegrationMutation,
} from "talk-admin/mutations";
import { withFragmentContainer } from "talk-framework/lib/relay";

import {
  AddSubmitHook,
  RemoveSubmitHook,
  SubmitHook,
  withSubmitHookContext,
} from "../../../submitHook";
import OIDCConfigContainer from "./OIDCConfigContainer";

interface Props {
  auth: AuthData;
  authReadOnly: AuthReadOnlyData;
  disabled?: boolean;
  addSubmitHook: AddSubmitHook;
  onInitValues: (values: AuthData) => void;
  createOIDCAuthIntegration: CreateOIDCAuthIntegrationMutation;
  updateOIDCAuthIntegration: UpdateOIDCAuthIntegrationMutation;
}

class OIDCConfigListContainer extends React.Component<Props> {
  private removeSubmitHook: RemoveSubmitHook;

  constructor(props: Props) {
    super(props);
    props.onInitValues(this.getAuthWithDefault());
    this.removeSubmitHook = this.props.addSubmitHook(this.submitHook);
  }

  public componentWillUnmount() {
    this.removeSubmitHook();
  }

  private submitHook: SubmitHook = async (data: any) => {
    const cloned = cloneDeep(data);
    const oidc = cloned.auth.integrations.oidc;
    delete cloned.auth.integrations.oidc;
    if (this.props.auth.integrations.oidc.length === 0) {
      await this.props.createOIDCAuthIntegration({ configuration: oidc[0] });
    } else {
      await this.props.updateOIDCAuthIntegration({
        configuration: oidc[0],
        id: this.props.authReadOnly.integrations.oidc[0].id,
      });
    }
    return cloned;
  };

  private getAuthWithDefault(): AuthData {
    return this.props.auth.integrations.oidc.length === 0
      ? ({
          integrations: {
            oidc: [
              {
                clientID: "",
                clientSecret: "",
                allowRegistration: false,
                targetFilter: {
                  admin: true,
                  stream: true,
                },
                name: "",
                authorizationURL: "",
                tokenURL: "",
                jwksURI: "",
                issuer: "",
              },
            ],
          },
        } as any)
      : this.props.auth;
  }

  public render() {
    const { disabled, authReadOnly } = this.props;
    const integrations = this.getAuthWithDefault().integrations.oidc.map(
      (data, i) => (
        <OIDCConfigContainer
          key={i}
          disabled={disabled}
          index={i}
          callbackURL={
            (authReadOnly.integrations.oidc[i] &&
              authReadOnly.integrations.oidc[i].callbackURL) ||
            ""
          }
        />
      )
    );
    return <>{integrations}</>;
  }
}

const enhanced = withFragmentContainer<Props>({
  auth: graphql`
    fragment OIDCConfigListContainer_auth on Auth {
      integrations {
        oidc {
          enabled
          allowRegistration
          targetFilter {
            admin
            stream
          }
          name
          clientID
          clientSecret
          authorizationURL
          tokenURL
          jwksURI
          issuer
        }
      }
    }
  `,
  authReadOnly: graphql`
    fragment OIDCConfigListContainer_authReadOnly on Auth {
      integrations {
        oidc {
          id
          callbackURL
        }
      }
    }
  `,
})(
  withCreateOIDCAuthIntegrationMutation(
    withUpdateOIDCAuthIntegrationMutation(
      withSubmitHookContext(addSubmitHook => ({ addSubmitHook }))(
        OIDCConfigListContainer
      )
    )
  )
);

export default enhanced;
