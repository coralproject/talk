import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { Button, ButtonIcon, HorizontalGutter } from "coral-ui/components/v2";

import { EmbedSectionContainer_comment } from "coral-stream/__generated__/EmbedSectionContainer_comment.graphql";
import { EmbedSectionContainer_settings } from "coral-stream/__generated__/EmbedSectionContainer_settings.graphql";

import { Embed } from "coral-stream/common/OEmbed";

import styles from "./EmbedSectionContainer.css";

interface Props {
  comment: EmbedSectionContainer_comment;
  settings: EmbedSectionContainer_settings;
}

const EmbedSectionContainer: FunctionComponent<Props> = ({
  comment,
  settings,
}) => {
  const { revision } = comment;
  const { embeds: embedSettings } = settings;
  const [expanded, setExpanded] = useState(false);
  const onToggleExpand = useCallback(() => {
    setExpanded(!expanded);
  }, [expanded, setExpanded]);

  if (
    !revision ||
    !revision.embeds ||
    revision.embeds.length <= 0 ||
    (!embedSettings.twitter && !embedSettings.youtube)
  ) {
    return null;
  }

  const embed = revision.embeds[0];

  if (
    (embed.source === "TWITTER" && !embedSettings.twitter) ||
    (embed.source === "YOUTUBE" && !embedSettings.youtube) ||
    (embed.source === "GIPHY" && !embedSettings.giphy)
  ) {
    return null;
  }

  if (!expanded) {
    return (
      <Button
        iconLeft
        variant="outline"
        color="stream"
        onClick={onToggleExpand}
        size="small"
        className={styles.button}
      >
        <ButtonIcon>add</ButtonIcon>
        {embed.source === "TWITTER" && (
          <Localized id="comments-embedLinks-show-twitter">
            Show tweet
          </Localized>
        )}
        {embed.source === "YOUTUBE" && (
          <Localized id="comments-embedLinks-show-youtube">
            Show video
          </Localized>
        )}
        {embed.source === "GIPHY" && (
          <Localized id="comments-embedLinks-show-giphy">Show gif</Localized>
        )}
      </Button>
    );
  }

  return (
    <HorizontalGutter>
      <div>
        <Button
          variant="outline"
          color="stream"
          onClick={onToggleExpand}
          size="small"
          iconLeft
          className={styles.button}
        >
          <ButtonIcon>remove</ButtonIcon>
          {embed.source === "TWITTER" && (
            <Localized id="comments-embedLinks-hide-twitter">
              Hide tweet
            </Localized>
          )}
          {embed.source === "GIPHY" && (
            <Localized id="comments-embedLinks-hide-giphy">Hide gif</Localized>
          )}
          {embed.source === "YOUTUBE" && (
            <Localized id="comments-embedLinks-hide-youtube">
              Hide video
            </Localized>
          )}
        </Button>
      </div>
      <Embed url={embed.url} type={embed.source} settings={settings.embeds} />
    </HorizontalGutter>
  );
};

const enhanced = withFragmentContainer<Props>({
  comment: graphql`
    fragment EmbedSectionContainer_comment on Comment {
      revision {
        embeds {
          url
          source
        }
      }
    }
  `,
  settings: graphql`
    fragment EmbedSectionContainer_settings on Settings {
      embeds {
        twitter
        youtube
        giphy
      }
    }
  `,
})(EmbedSectionContainer);

export default enhanced;
