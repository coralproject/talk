import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useMemo } from "react";
import { graphql } from "react-relay";

import { getModerationLink } from "coral-framework/helpers";
import { ExternalLink } from "coral-framework/lib/i18n/components";
import {
  withFragmentContainer,
  withLocalStateContainer,
} from "coral-framework/lib/relay";
import { Typography } from "coral-ui/components";

import { ModerateStreamContainer_settings } from "coral-stream/__generated__/ModerateStreamContainer_settings.graphql";
import { ModerateStreamContainer_story } from "coral-stream/__generated__/ModerateStreamContainer_story.graphql";
import { ModerateStreamContainerLocal } from "coral-stream/__generated__/ModerateStreamContainerLocal.graphql";

interface Props {
  local: ModerateStreamContainerLocal;
  settings: ModerateStreamContainer_settings;
  story: ModerateStreamContainer_story;
}

const ModerateStreamContainer: FunctionComponent<Props> = ({
  local: { accessToken },
  settings,
  story: { id },
}) => {
  const href = useMemo(() => {
    let link = getModerationLink({ storyID: id });
    if (
      accessToken &&
      settings.auth.integrations.sso.enabled &&
      settings.auth.integrations.sso.targetFilter.admin
    ) {
      link += `#accessToken=${accessToken}`;
    }

    return link;
  }, [accessToken, settings, id]);

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
  settings: graphql`
    fragment ModerateStreamContainer_settings on Settings {
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
