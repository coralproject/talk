import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { GQLEMBED_LINK_SOURCE } from "coral-framework/schema";
import { TwitterEmbed, YouTubeEmbed } from "coral-stream/common/OEmbed";
import { Button } from "coral-ui/components/v2";

import {
  EMBED_LINK_SOURCE,
  EmbedSectionContainer_comment,
} from "coral-stream/__generated__/EmbedSectionContainer_comment.graphql";
import { EmbedSectionContainer_settings } from "coral-stream/__generated__/EmbedSectionContainer_settings.graphql";

interface Props {
  comment: EmbedSectionContainer_comment;
  settings: EmbedSectionContainer_settings;
}

const getEmbed = (
  index: number,
  url: string,
  type: EMBED_LINK_SOURCE,
  settings: EmbedSectionContainer_settings
) => {
  if (
    type === GQLEMBED_LINK_SOURCE.TWITTER &&
    settings.embedLinks.twitterEnabled
  ) {
    return <TwitterEmbed url={url} key={index} />;
  }

  if (
    type === GQLEMBED_LINK_SOURCE.YOUTUBE &&
    settings.embedLinks.youtubeEnabled
  ) {
    return <YouTubeEmbed url={url} key={index} />;
  }

  return null;
};

const EmbedSectionContainer: FunctionComponent<Props> = ({
  comment,
  settings,
}) => {
  const { revision } = comment;
  const { embedLinks: embedSettings } = settings;
  const [expanded, setExpanded] = useState(false);
  const onToggleExpand = useCallback(() => {
    setExpanded(!expanded);
  }, [expanded, setExpanded]);

  if (
    !revision ||
    !revision.embedLinks ||
    revision.embedLinks.length <= 0 ||
    (!embedSettings.twitterEnabled && !embedSettings.youtubeEnabled)
  ) {
    return null;
  }

  const onlyTwitter = revision.embedLinks.every(
    (l) => l.source === GQLEMBED_LINK_SOURCE.TWITTER
  );
  const onlyYoutube = revision.embedLinks.every(
    (l) => l.source === GQLEMBED_LINK_SOURCE.YOUTUBE
  );

  if (!embedSettings.twitterEnabled && onlyTwitter) {
    return null;
  }
  if (!embedSettings.youtubeEnabled && onlyYoutube) {
    return null;
  }

  if (!expanded) {
    return (
      <Localized id="comments-embedLinks-showEmbeds">
        <Button onClick={onToggleExpand}>Show embeds</Button>
      </Localized>
    );
  }

  return (
    <>
      <Localized id="comments-embedLinks-hideEmbeds">
        <Button onClick={onToggleExpand}>Hide embeds</Button>
      </Localized>
      {revision.embedLinks.map((link, index) =>
        getEmbed(index, link.url, link.source, settings)
      )}
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
  comment: graphql`
    fragment EmbedSectionContainer_comment on Comment {
      revision {
        embedLinks {
          url
          source
        }
      }
    }
  `,
  settings: graphql`
    fragment EmbedSectionContainer_settings on Settings {
      embedLinks {
        twitterEnabled
        youtubeEnabled
      }
    }
  `,
})(EmbedSectionContainer);

export default enhanced;
