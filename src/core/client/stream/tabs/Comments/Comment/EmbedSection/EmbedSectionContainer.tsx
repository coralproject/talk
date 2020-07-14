import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import {
  GiphyEmbed,
  TwitterEmbed,
  YouTubeEmbed,
} from "coral-stream/common/Embed";
import { Button, ButtonIcon, HorizontalGutter } from "coral-ui/components/v2";

import { EmbedSectionContainer_comment } from "coral-stream/__generated__/EmbedSectionContainer_comment.graphql";
import { EmbedSectionContainer_settings } from "coral-stream/__generated__/EmbedSectionContainer_settings.graphql";

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
    setExpanded((v) => !v);
  }, []);

  if (!revision || !revision.embed || !embedSettings) {
    return null;
  }

  const { embed } = revision;

  if (
    !embedSettings ||
    (embed.__typename === "TwitterEmbed" &&
      (!embedSettings.twitter || !embedSettings.twitter.enabled)) ||
    (embed.__typename === "YoutubeEmbed" &&
      (!embedSettings.youtube || !embedSettings.youtube.enabled)) ||
    (embed.__typename === "GiphyEmbed" &&
      (!embedSettings.giphy || !embedSettings.giphy.enabled))
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
        {embed.__typename === "TwitterEmbed" && (
          <Localized id="comments-embedLinks-show-twitter">
            Show tweet
          </Localized>
        )}
        {embed.__typename === "YoutubeEmbed" && (
          <Localized id="comments-embedLinks-show-youtube">
            Show video
          </Localized>
        )}
        {embed.__typename === "GiphyEmbed" && (
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
          {embed.__typename === "TwitterEmbed" && (
            <Localized id="comments-embedLinks-hide-twitter">
              Hide tweet
            </Localized>
          )}
          {embed.__typename === "GiphyEmbed" && (
            <Localized id="comments-embedLinks-hide-giphy">Hide gif</Localized>
          )}
          {embed.__typename === "YoutubeEmbed" && (
            <Localized id="comments-embedLinks-hide-youtube">
              Hide video
            </Localized>
          )}
        </Button>
      </div>
      {embed.__typename === "TwitterEmbed" && (
        <TwitterEmbed url={embed.url} width={embed.width} />
      )}
      {embed.__typename === "YoutubeEmbed" && (
        <YouTubeEmbed
          url={embed.url}
          width={embed.width}
          height={embed.height}
        />
      )}
      {embed.__typename === "GiphyEmbed" && (
        <GiphyEmbed
          url={embed.url}
          width={embed.width}
          height={embed.height}
          title={embed.title}
          video={embed.video}
        />
      )}
    </HorizontalGutter>
  );
};

const enhanced = withFragmentContainer<Props>({
  comment: graphql`
    fragment EmbedSectionContainer_comment on Comment {
      revision {
        embed {
          __typename
          ... on GiphyEmbed {
            url
            title
            width
            height
            still
            video
          }
          ... on TwitterEmbed {
            url
            width
          }
          ... on YoutubeEmbed {
            url
            width
            height
          }
        }
      }
    }
  `,
  settings: graphql`
    fragment EmbedSectionContainer_settings on Settings {
      embeds {
        twitter {
          enabled
        }
        youtube {
          enabled
        }
        giphy {
          enabled
        }
      }
    }
  `,
})(EmbedSectionContainer);

export default enhanced;
