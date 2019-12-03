import { FormApi } from "final-form";
import React from "react";
import { graphql } from "react-relay";

import { withForm } from "coral-framework/lib/form";
import {
  FetchProp,
  withFetch,
  withFragmentContainer,
} from "coral-framework/lib/relay";

import { OIDCConfig_formValues } from "coral-admin/__generated__/OIDCConfig_formValues.graphql";
import { OIDCConfigContainer_auth as AuthData } from "coral-admin/__generated__/OIDCConfigContainer_auth.graphql";

import DiscoverOIDCConfigurationFetch from "./DiscoverOIDCConfigurationFetch";
import OIDCConfig from "./OIDCConfig";

interface Props {
  auth: AuthData;
  disabled?: boolean;
  discoverOIDCConfiguration: FetchProp<typeof DiscoverOIDCConfigurationFetch>;
  form: FormApi<{ auth: AuthData & OIDCConfig_formValues }>;
}

interface State {
  awaitingResponse: boolean;
}

class OIDCConfigContainer extends React.Component<Props, State> {
  public state = {
    awaitingResponse: false,
  };

  private handleDiscover = async () => {
    const issuer = this.props.form.getState().values.auth.integrations.oidc
      .issuer;
    if (!issuer) {
      return;
    }
    this.setState({ awaitingResponse: true });
    try {
      const config = await this.props.discoverOIDCConfiguration({
        issuer,
      });
      if (config) {
        if (config.issuer) {
          this.props.form.change(
            "auth.integrations.oidc.issuer",
            config.issuer
          );
        }
        this.props.form.change(
          "auth.integrations.oidc.authorizationURL",
          config.authorizationURL
        );
        this.props.form.change(
          "auth.integrations.oidc.jwksURI",
          config.jwksURI
        );
        this.props.form.change(
          "auth.integrations.oidc.tokenURL",
          config.tokenURL
        );
      }
    } catch (error) {
      // FIXME: (wyattjoh) handle error
      // eslint-disable-next-line no-console
      console.warn(error);
    }
    this.setState({ awaitingResponse: false });
  };

  public render() {
    const { disabled, auth } = this.props;
    return (
      <OIDCConfig
        disabled={disabled}
        callbackURL={auth.integrations.oidc.callbackURL}
        onDiscover={this.handleDiscover}
        disableForDiscover={this.state.awaitingResponse}
      />
    );
  }
}

const enhanced = withForm(
  withFetch(DiscoverOIDCConfigurationFetch)(
    withFragmentContainer<Props>({
      auth: graphql`
        fragment OIDCConfigContainer_auth on Auth {
          integrations {
            oidc {
              callbackURL
            }
          }
        }
      `,
    })(OIDCConfigContainer)
  )
);

export default enhanced;
