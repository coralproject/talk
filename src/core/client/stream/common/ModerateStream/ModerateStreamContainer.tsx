import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useMemo } from "react";
import { graphql, useFragment } from "react-relay";

import { getModerationLink } from "coral-framework/helpers";
import { useLocal } from "coral-framework/lib/relay";
import { Ability, can } from "coral-framework/permissions";
import CLASSES from "coral-stream/classes";
import { Button } from "coral-ui/components/v3";

import { ModerateStreamContainer_settings$key as ModerateStreamContainer_settings } from "coral-stream/__generated__/ModerateStreamContainer_settings.graphql";
import { ModerateStreamContainer_story$key as ModerateStreamContainer_story } from "coral-stream/__generated__/ModerateStreamContainer_story.graphql";
import { ModerateStreamContainer_viewer$key as ModerateStreamContainer_viewer } from "coral-stream/__generated__/ModerateStreamContainer_viewer.graphql";
import { ModerateStreamContainerLocal } from "coral-stream/__generated__/ModerateStreamContainerLocal.graphql";

interface Props {
  settings: ModerateStreamContainer_settings;
  viewer: ModerateStreamContainer_viewer | null;
  story: ModerateStreamContainer_story;
}

const ModerateStreamContainer: FunctionComponent<Props> = ({
  settings,
  story,
  viewer,
}) => {
  const settingsData = useFragment(
    graphql`
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
    settings
  );

  const storyData = useFragment(
    graphql`
      fragment ModerateStreamContainer_story on Story {
        id
        canModerate
        isArchived
        isArchiving
      }
    `,
    story
  );
  const viewerData = useFragment(
    graphql`
      fragment ModerateStreamContainer_viewer on User {
        role
      }
    `,
    viewer
  );

  const { id, canModerate, isArchived, isArchiving } = storyData;

  const [{ accessToken }] = useLocal<ModerateStreamContainerLocal>(graphql`
    fragment ModerateStreamContainerLocal on Local {
      accessToken
    }
  `);
  const href = useMemo(() => {
    let link = getModerationLink({ storyID: id });
    if (
      accessToken &&
      settingsData.auth.integrations.sso.enabled &&
      settingsData.auth.integrations.sso.targetFilter.admin
    ) {
      link += `#accessToken=${accessToken}`;
    }

    return link;
  }, [accessToken, settingsData, id]);

  if (!canModerate || !viewerData || !can(viewerData, Ability.MODERATE)) {
    return null;
  }

  if (isArchived || isArchiving) {
    return null;
  }

  return (
    <Button
      className={CLASSES.moderateStream}
      variant="outlined"
      color="primary"
      paddingSize="small"
      fontSize="small"
      href={href}
      target="_blank"
      upperCase
    >
      <Localized id="general-moderate">Moderate</Localized>
    </Button>
  );
};

export default ModerateStreamContainer;
