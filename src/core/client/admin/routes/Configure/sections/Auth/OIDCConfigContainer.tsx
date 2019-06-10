import { FormApi } from "final-form";
import React from "react";
import { ReactContext, withReactFinalForm } from "react-final-form";
import { graphql } from "react-relay";
import { InferableComponentEnhancer } from "recompose";

import { OIDCConfigContainer_auth as AuthData } from "coral-admin/__generated__/OIDCConfigContainer_auth.graphql";
import { OIDCConfigContainer_authReadOnly as AuthReadOnlyData } from "coral-admin/__generated__/OIDCConfigContainer_authReadOnly.graphql";
import {
  FetchProp,
  withFetch,
  withFragmentContainer,
} from "coral-framework/lib/relay";

import DiscoverOIDCConfigurationFetch from "./DiscoverOIDCConfigurationFetch";
import OIDCConfig from "./OIDCConfig";

interface Props {
  auth: AuthData;
  authReadOnly: AuthReadOnlyData;
  onInitValues: (values: AuthData) => void;
  disabled?: boolean;
  discoverOIDCConfiguration: FetchProp<typeof DiscoverOIDCConfigurationFetch>;
  reactFinalForm: FormApi;
}

interface State {
  awaitingResponse: boolean;
}

class OIDCConfigContainer extends React.Component<Props, State> {
  public state = {
    awaitingResponse: false,
  };

  private handleDiscover = async () => {
    const form = this.props.reactFinalForm;
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

// (cvle) Fix `withReactFinalForm` typings (v4.1.0), forgive this, we'll
// probably only use hooks in the future instead anyway ;-)
const withForm = withReactFinalForm as InferableComponentEnhancer<ReactContext>;

const enhanced = withForm(
  withFetch(DiscoverOIDCConfigurationFetch)(
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
  )
);

export default enhanced;
