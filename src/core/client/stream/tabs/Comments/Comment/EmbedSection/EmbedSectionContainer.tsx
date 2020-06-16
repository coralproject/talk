import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { GQLEMBED_SOURCE } from "coral-framework/schema";
import { TwitterEmbed, YouTubeEmbed } from "coral-stream/common/OEmbed";
import { Button, ButtonIcon, HorizontalGutter } from "coral-ui/components/v2";

import {
  EMBED_SOURCE,
  EmbedSectionContainer_comment,
} from "coral-stream/__generated__/EmbedSectionContainer_comment.graphql";
import { EmbedSectionContainer_settings } from "coral-stream/__generated__/EmbedSectionContainer_settings.graphql";

interface Props {
  comment: EmbedSectionContainer_comment;
  settings: EmbedSectionContainer_settings;
}

const getEmbed = (
  url: string,
  type: EMBED_SOURCE,
  settings: EmbedSectionContainer_settings
) => {
  if (type === GQLEMBED_SOURCE.TWITTER && settings.embeds.twitter) {
    return <TwitterEmbed url={url} />;
  }

  if (type === GQLEMBED_SOURCE.YOUTUBE && settings.embeds.youtube) {
    return <YouTubeEmbed url={url} />;
  }

  if (type === GQLEMBED_SOURCE.GIPHY && settings.embeds.giphy) {
    return <img src={url} />;
  }

  return null;
};

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
    (embed.source === GQLEMBED_SOURCE.TWITTER && !embedSettings.twitter) ||
    (embed.source === GQLEMBED_SOURCE.YOUTUBE && !embedSettings.youtube) ||
    (embed.source === GQLEMBED_SOURCE.GIPHY && !embedSettings.giphy)
  ) {
    return null;
  }

  if (!expanded) {
    if (embed.source === GQLEMBED_SOURCE.TWITTER) {
      return (
        <Button
          iconLeft
          variant="outline"
          color="stream"
          onClick={onToggleExpand}
          size="small"
        >
          <ButtonIcon>add</ButtonIcon>
          <Localized id="comments-embedLinks-show-twitter">
            Show tweet
          </Localized>
        </Button>
      );
    } else if (embed.source === GQLEMBED_SOURCE.GIPHY) {
      return (
        <Button
          iconLeft
          variant="outline"
          color="stream"
          size="small"
          onClick={onToggleExpand}
        >
          <ButtonIcon>add</ButtonIcon>
          <Localized id="comments-embedLinks-show-giphy">Show gif</Localized>
        </Button>
      );
    } else if (embed.source === GQLEMBED_SOURCE.YOUTUBE) {
      return (
        <Button
          iconLeft
          size="small"
          variant="outline"
          color="stream"
          onClick={onToggleExpand}
        >
          <ButtonIcon>add</ButtonIcon>
          <Localized id="comments-embedLinks-show-youtube">
            Show video
          </Localized>
        </Button>
      );
    }
  }

  return (
    <HorizontalGutter>
      <div>
        {embed.source === GQLEMBED_SOURCE.TWITTER && (
          <Button
            variant="outline"
            color="stream"
            onClick={onToggleExpand}
            size="small"
            iconLeft
          >
            <ButtonIcon>remove</ButtonIcon>
            <Localized id="comments-embedLinks-hide-twitter">
              Hide tweet
            </Localized>
          </Button>
        )}
        {embed.source === GQLEMBED_SOURCE.GIPHY && (
          <Button
            variant="outline"
            color="stream"
            size="small"
            onClick={onToggleExpand}
            iconLeft
          >
            <ButtonIcon>remove</ButtonIcon>
            <Localized id="comments-embedLinks-hide-giphy">Hide gif</Localized>
          </Button>
        )}
        {embed.source === GQLEMBED_SOURCE.YOUTUBE && (
          <Button
            variant="outline"
            color="stream"
            size="small"
            onClick={onToggleExpand}
            iconLeft
          >
            <ButtonIcon>remove</ButtonIcon>
            <Localized id="comments-embedLinks-hide-youtube">
              Hide video
            </Localized>
          </Button>
        )}
      </div>
      {getEmbed(embed.url, embed.source, settings)}
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
