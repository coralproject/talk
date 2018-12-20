import { FormApi } from "final-form";
import PropTypes from "prop-types";
import React from "react";
import { graphql } from "react-relay";

import { OIDCConfigContainer_auth as AuthData } from "talk-admin/__generated__/OIDCConfigContainer_auth.graphql";
import { OIDCConfigContainer_authReadOnly as AuthReadOnlyData } from "talk-admin/__generated__/OIDCConfigContainer_authReadOnly.graphql";
import {
  DiscoverOIDCConfigurationFetch,
  withDiscoverOIDCConfigurationFetch,
} from "talk-admin/fetches";
import { withFragmentContainer } from "talk-framework/lib/relay";

import OIDCConfig from "../components/OIDCConfig";

interface Props {
  auth: AuthData;
  authReadOnly: AuthReadOnlyData;
  onInitValues: (values: AuthData) => void;
  disabled?: boolean;
  discoverOIDCConfiguration: DiscoverOIDCConfigurationFetch;
}

interface State {
  awaitingResponse: boolean;
}

class OIDCConfigContainer extends React.Component<Props, State> {
  public static contextTypes = {
    reactFinalForm: PropTypes.object,
  };

  public state = {
    awaitingResponse: false,
  };

  private handleDiscover = async () => {
    const form = this.context.reactFinalForm as FormApi;
    this.setState({ awaitingResponse: true });
    try {
      const config = await this.props.discoverOIDCConfiguration({
        issuer: form.getState().values.auth.integrations.oidc.issuer,
      });
      if (config) {
        form.change(
          "auth.integrations.oidc.authorizationURL",
          config.authorizationURL
        );
        form.change("auth.integrations.oidc.jwksURI", config.jwksURI);
        form.change("auth.integrations.oidc.tokenURL", config.tokenURL);
      }
    } catch (error) {
      // tslint:disable-next-line:no-console
      console.warn(error);
    }
    this.setState({ awaitingResponse: false });
  };

  constructor(props: Props) {
    super(props);
    props.onInitValues(props.auth);
  }

  public render() {
    const { disabled, authReadOnly } = this.props;
    return (
      <OIDCConfig
        disabled={disabled}
        callbackURL={authReadOnly.integrations.oidc.callbackURL}
        onDiscover={this.handleDiscover}
        disableForDiscover={this.state.awaitingResponse}
      />
    );
  }
}

const enhanced = withDiscoverOIDCConfigurationFetch(
  withFragmentContainer<Props>({
    auth: graphql`
      fragment OIDCConfigContainer_auth on Auth {
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
      fragment OIDCConfigContainer_authReadOnly on Auth {
        integrations {
          oidc {
            callbackURL
          }
        }
      }
    `,
  })(OIDCConfigContainer)
);

export default enhanced;
