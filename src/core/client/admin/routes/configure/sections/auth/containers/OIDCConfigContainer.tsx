import { FormApi } from "final-form";
import PropTypes from "prop-types";
import React from "react";

import {
  DiscoverOIDCConfigurationFetch,
  withDiscoverOIDCConfigurationFetch,
} from "talk-admin/fetches";

import OIDCConfig from "../components/OIDCConfig";

interface Props {
  index: number;
  callbackURL: string;
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
        issuer: form.getState().values.auth.integrations.oidc[0].issuer,
      });
      if (config) {
        form.change(
          "auth.integrations.oidc.0.authorizationURL",
          config.authorizationURL
        );
        form.change("auth.integrations.oidc.0.jwksURI", config.jwksURI);
        form.change("auth.integrations.oidc.0.tokenURL", config.tokenURL);
      }
    } catch (error) {
      // tslint:disable-next-line:no-console
      console.warn(error);
    }
    this.setState({ awaitingResponse: false });
  };

  public render() {
    const { disabled, index, callbackURL } = this.props;
    return (
      <OIDCConfig
        disabled={disabled}
        index={index}
        callbackURL={callbackURL}
        onDiscover={this.handleDiscover}
        disableForDiscover={this.state.awaitingResponse}
      />
    );
  }
}

const enhanced = withDiscoverOIDCConfigurationFetch(OIDCConfigContainer);

export default enhanced;
