import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useMemo } from "react";
import { graphql, useFragment } from "react-relay";

import { getModerationLink } from "coral-framework/helpers";
import { useLocal } from "coral-framework/lib/relay";
import { Ability, can } from "coral-framework/permissions";
import { Button } from "coral-ui/components/v3/Button/Button";

import { ModerateStoryButton_local } from "coral-admin/__generated__/ModerateStoryButton_local.graphql";
import { ModerateStoryButton_settings$key as ModerateStoryButton_settings } from "coral-admin/__generated__/ModerateStoryButton_settings.graphql";
import { ModerateStoryButton_story$key as ModerateStoryButton_story } from "coral-admin/__generated__/ModerateStoryButton_story.graphql";
import { ModerateStoryButton_viewer$key as ModerateStoryButton_viewer } from "coral-admin/__generated__/ModerateStoryButton_viewer.graphql";

import styles from "./ModerateStoryButton.css";

export interface Props {
  settings: ModerateStoryButton_settings;
  viewer: ModerateStoryButton_viewer;
  story: ModerateStoryButton_story;
}

const ModerateStoryButton: FunctionComponent<Props> = ({
  settings,
  story,
  viewer,
}) => {
  const { id, isArchived, isArchiving, canModerate } = useFragment(
    graphql`
      fragment ModerateStoryButton_story on Story {
        canModerate
        isArchiving
        isArchived
        id
      }
    `,
    story
  );
  const settingsData = useFragment(
    graphql`
      fragment ModerateStoryButton_settings on Settings {
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
  const viewerData = useFragment(
    graphql`
      fragment ModerateStoryButton_viewer on User {
        role
      }
    `,
    viewer
  );

  const [{ accessToken }] = useLocal<ModerateStoryButton_local>(graphql`
    fragment ModerateStoryButton_local on Local {
      accessToken
    }
  `);

  const href = useMemo(() => {
    // TODO: (marcushaddon) this will need to be updated to use the new hook once https://github.com/coralproject/talk/pull/3796 dom is merged!
    // TODO: (marcushaddon) once https://github.com/coralproject/talk/pull/3796 is merged, update the new hook to take access token as an argument
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
    <Localized id="storyInfoDrawer-moderateStory">
      <Button
        className={styles.moderateStory}
        variant="outlined"
        color="primary"
        paddingSize="small"
        fontSize="extraSmall"
        href={href}
        target="_blank"
        upperCase
      >
        Moderate
      </Button>
    </Localized>
  );
};

export default ModerateStoryButton;
