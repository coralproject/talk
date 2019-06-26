import { Localized } from "fluent-react/compat";
import React, { useMemo } from "react";

import { parseJWT } from "coral-framework/lib/jwt";
import {
  Button,
  Flex,
  HorizontalGutter,
  Typography,
} from "coral-ui/components";

interface Props {
  token: string;
  organizationName: string;
}

const Success: React.FunctionComponent<Props> = ({
  token,
  organizationName,
}) => {
  const email = useMemo(() => parseJWT(token).payload.email, [token]);

  return (
    <HorizontalGutter size="double">
      <Localized id="invite-successful">
        <Typography variant="heading1">
          Your account has been created
        </Typography>
      </Localized>
      <Localized id="invite-youMayNowSignIn" $email={email}>
        <Typography variant="bodyCopy">
          You may now sign-in to Coral using: {email}
        </Typography>
      </Localized>
      <Flex justifyContent="center" direction="column" spacing={3}>
        <Localized id="invite-goToAdmin">
          <a href="/admin">Go to Coral Admin</a>
        </Localized>
        <Localized
          id="invite-goToOrganization"
          $organizationName={organizationName}
        >
          <a href="/">Go to {organizationName}</a>
        </Localized>
      </Flex>
    </HorizontalGutter>
  );
};

export default Success;
