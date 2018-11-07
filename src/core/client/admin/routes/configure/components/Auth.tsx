import React, { StatelessComponent } from "react";

import { HorizontalGutter, TextLink, Typography } from "talk-ui/components";

import ConfigBox from "./ConfigBox";
import Header from "./Header";

const Auth: StatelessComponent = () => (
  <div>
    <Header>Auth Integrations</Header>
    <HorizontalGutter size="double">
      <ConfigBox title="Login with Google">
        <Typography>
          To enable the integration with Google Authentication you need to
          create and set up a web application. For more information visit:<br/>
          <TextLink>https://developers.google.com/identity/protocols/OAuth2WebServer#creatingcred</TextLink>
        </Typography>
      </ConfigBox>
      <ConfigBox title="Login with Facebook">
        <Typography>
          To enable the integration with Facebook Authentication you need to
          create and set up a web application. For more information visit:<br/>
          <TextLink>https://developers.facebook.com/docs/facebook-login/web</TextLink>
        </Typography>
      </ConfigBox>
    </HorizontalGutter>
  </div>
);

export default Auth;
