import { Localized } from "@fluent/react/compat";
import { Link } from "found";
import React, { useMemo } from "react";

import { parseAccessTokenClaims } from "coral-framework/lib/auth/helpers";
import { ExternalLink } from "coral-framework/lib/i18n/components";
import { HorizontalGutter, Typography } from "coral-ui/components/v2";

import styles from "./Success.css";

interface Props {
  token: string;
  organizationName: string;
  organizationURL: string;
}

const Success: React.FunctionComponent<Props> = ({
  token,
  organizationName,
  organizationURL,
}) => {
  const email = useMemo(() => {
    const claims = parseAccessTokenClaims<{ email?: string }>(token);
    if (!claims) {
      return null;
    }

    return claims.email;
  }, [token]);

  return (
    <HorizontalGutter
      spacing={3}
      className={styles.root}
      data-testid="invite-complete-success"
    >
      <Localized id="invite-successful">
        <Typography variant="heading1">
          Your account has been created
        </Typography>
      </Localized>
      <Localized id="invite-youMayNowSignIn">
        <Typography variant="bodyCopy">
          You may now sign-in to Coral using:
        </Typography>
      </Localized>
      <Typography variant="heading2">{email}</Typography>
      <HorizontalGutter paddingTop={4} spacing={3}>
        <Localized id="invite-goToAdmin">
          <Link to="/admin" className={styles.link}>
            Go to Coral Admin
          </Link>
        </Localized>
        <Localized id="invite-goToOrganization" vars={{ organizationName }}>
          <ExternalLink href={organizationURL} className={styles.link}>
            {"Go to {$organizationName}"}
          </ExternalLink>
        </Localized>
      </HorizontalGutter>
    </HorizontalGutter>
  );
};

export default Success;
