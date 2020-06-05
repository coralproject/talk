import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useMemo } from "react";
import { graphql } from "react-relay";

import { getModerationLink } from "coral-framework/helpers";
import {
  withFragmentContainer,
  withLocalStateContainer,
} from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import { Ability, can } from "coral-stream/permissions";
import { Button } from "coral-ui/components/v3";

import { ModerateStreamContainer_settings } from "coral-stream/__generated__/ModerateStreamContainer_settings.graphql";
import { ModerateStreamContainer_story } from "coral-stream/__generated__/ModerateStreamContainer_story.graphql";
import { ModerateStreamContainer_viewer } from "coral-stream/__generated__/ModerateStreamContainer_viewer.graphql";
import { ModerateStreamContainerLocal } from "coral-stream/__generated__/ModerateStreamContainerLocal.graphql";

interface Props {
  local: ModerateStreamContainerLocal;
  settings: ModerateStreamContainer_settings;
  viewer: ModerateStreamContainer_viewer | null;
  story: ModerateStreamContainer_story;
}

const ModerateStreamContainer: FunctionComponent<Props> = ({
  local: { accessToken },
  settings,
  story: { id },
  viewer,
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

  if (!viewer || !can(viewer, Ability.MODERATE)) {
    return null;
  }

  return (
    <Button
      className={CLASSES.moderateStream}
      variant="outlined"
      color="primary"
      marginSize="small"
      textSize="small"
      href={href}
      target="_blank"
      upperCase
    >
      <Localized id="general-moderate">Moderate</Localized>
    </Button>
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
  viewer: graphql`
    fragment ModerateStreamContainer_viewer on User {
      role
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
