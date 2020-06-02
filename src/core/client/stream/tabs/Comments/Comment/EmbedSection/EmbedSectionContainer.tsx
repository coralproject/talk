import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { GQLEMBED_SOURCE } from "coral-framework/schema";
import { TwitterEmbed, YouTubeEmbed } from "coral-stream/common/OEmbed";
import { Button } from "coral-ui/components/v2";

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
  index: number,
  url: string,
  type: EMBED_SOURCE,
  settings: EmbedSectionContainer_settings
) => {
  if (type === GQLEMBED_SOURCE.TWITTER && settings.embeds.twitter) {
    return <TwitterEmbed url={url} key={index} />;
  }

  if (type === GQLEMBED_SOURCE.YOUTUBE && settings.embeds.youtube) {
    return <YouTubeEmbed url={url} key={index} />;
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

  const onlyTwitter = revision.embeds.every(
    (l) => l.source === GQLEMBED_SOURCE.TWITTER
  );
  const onlyYoutube = revision.embeds.every(
    (l) => l.source === GQLEMBED_SOURCE.YOUTUBE
  );

  if (!embedSettings.twitter && onlyTwitter) {
    return null;
  }
  if (!embedSettings.youtube && onlyYoutube) {
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
      {revision.embeds.map((link, index) =>
        getEmbed(index, link.url, link.source, settings)
      )}
    </>
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
      }
    }
  `,
})(EmbedSectionContainer);

export default enhanced;
