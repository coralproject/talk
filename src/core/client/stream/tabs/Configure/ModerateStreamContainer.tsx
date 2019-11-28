import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useMemo } from "react";
import { graphql } from "react-relay";

import { urls } from "coral-framework/helpers";
import { ExternalLink } from "coral-framework/lib/i18n/components";
import {
  withFragmentContainer,
  withLocalStateContainer,
} from "coral-framework/lib/relay";
import { Typography } from "coral-ui/components";

import { ModerateStreamContainer_organization } from "coral-stream/__generated__/ModerateStreamContainer_organization.graphql";
import { ModerateStreamContainer_story } from "coral-stream/__generated__/ModerateStreamContainer_story.graphql";
import { ModerateStreamContainerLocal } from "coral-stream/__generated__/ModerateStreamContainerLocal.graphql";

interface Props {
  local: ModerateStreamContainerLocal;
  organization: ModerateStreamContainer_organization;
  story: ModerateStreamContainer_story;
}

const ModerateStreamContainer: FunctionComponent<Props> = ({
  local: { accessToken },
  organization,
  story: { id },
}) => {
  const href = useMemo(() => {
    let link = urls.admin.moderateReported + "/" + id;
    if (
      accessToken &&
      organization.auth.integrations.sso.enabled &&
      organization.auth.integrations.sso.targetFilter.admin
    ) {
      link += `#accessToken=${accessToken}`;
    }

    return link;
  }, [accessToken, organization, id]);

  return (
    <div>
      <Typography variant="heading2">
        <Localized id="configure-moderateThisStream">
          <ExternalLink href={href}>Moderate this stream</ExternalLink>
        </Localized>
      </Typography>
    </div>
  );
};

const enhanced = withFragmentContainer<Props>({
  organization: graphql`
    fragment ModerateStreamContainer_organization on Organization {
      auth {
        integrations {
          sso {
            enabled
            targetFilter {
              admin
            }
          }
        }
      }
    }
  `,
  story: graphql`
    fragment ModerateStreamContainer_story on Story {
      id
    }
  `,
})(
  withLocalStateContainer(graphql`
    fragment ModerateStreamContainerLocal on Local {
      accessToken
    }
  `)(ModerateStreamContainer)
);

export default enhanced;
