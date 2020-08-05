import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import {
  GiphyMedia,
  TwitterMedia,
  YouTubeMedia,
} from "coral-stream/common/Media";
import { Button, ButtonIcon, HorizontalGutter } from "coral-ui/components/v2";

import { MediaSectionContainer_comment } from "coral-stream/__generated__/MediaSectionContainer_comment.graphql";
import { MediaSectionContainer_settings } from "coral-stream/__generated__/MediaSectionContainer_settings.graphql";

import styles from "./MediaSectionContainer.css";

interface Props {
  comment: MediaSectionContainer_comment;
  settings: MediaSectionContainer_settings;
}

const MediaSectionContainer: FunctionComponent<Props> = ({
  comment,
  settings,
}) => {
  const { revision } = comment;
  const [expanded, setExpanded] = useState(false);
  const onToggleExpand = useCallback(() => {
    setExpanded((v) => !v);
  }, []);

  if (!revision || !revision.media || !settings.media) {
    return null;
  }

  const { media } = revision;

  if (
    !settings.media ||
    (media.__typename === "TwitterMedia" &&
      (!settings.media.twitter || !settings.media.twitter.enabled)) ||
    (media.__typename === "YouTubeMedia" &&
      (!settings.media.youtube || !settings.media.youtube.enabled)) ||
    (media.__typename === "GiphyMedia" &&
      (!settings.media.giphy || !settings.media.giphy.enabled))
  ) {
    return null;
  }

  if (!expanded) {
    return (
      <Button
        iconLeft
        variant="outlined"
        color="stream"
        onClick={onToggleExpand}
        size="small"
        className={styles.button}
      >
        <ButtonIcon>add</ButtonIcon>
        {media.__typename === "TwitterMedia" && (
          <Localized id="comments-embedLinks-show-twitter">
            Show Tweet
          </Localized>
        )}
        {media.__typename === "YouTubeMedia" && (
          <Localized id="comments-embedLinks-show-youtube">
            Show video
          </Localized>
        )}
        {media.__typename === "GiphyMedia" && (
          <Localized id="comments-embedLinks-show-giphy">Show GIF</Localized>
        )}
      </Button>
    );
  }

  return (
    <HorizontalGutter>
      <div>
        <Button
          variant="outlined"
          color="stream"
          onClick={onToggleExpand}
          size="small"
          iconLeft
          className={styles.button}
        >
          <ButtonIcon>remove</ButtonIcon>
          {media.__typename === "TwitterMedia" && (
            <Localized id="comments-embedLinks-hide-twitter">
              Hide Tweet
            </Localized>
          )}
          {media.__typename === "GiphyMedia" && (
            <Localized id="comments-embedLinks-hide-giphy">Hide GIF</Localized>
          )}
          {media.__typename === "YouTubeMedia" && (
            <Localized id="comments-embedLinks-hide-youtube">
              Hide video
            </Localized>
          )}
        </Button>
      </div>
      {media.__typename === "TwitterMedia" && (
        <TwitterMedia
          url={media.url}
          width={media.width}
          siteID={comment.site.id}
        />
      )}
      {media.__typename === "YouTubeMedia" && (
        <YouTubeMedia
          url={media.url}
          width={media.width}
          height={media.height}
          siteID={comment.site.id}
        />
      )}
      {media.__typename === "GiphyMedia" && (
        <GiphyMedia
          url={media.url}
          width={media.width}
          height={media.height}
          title={media.title}
          video={media.video}
        />
      )}
    </HorizontalGutter>
  );
};

const enhanced = withFragmentContainer<Props>({
  comment: graphql`
    fragment MediaSectionContainer_comment on Comment {
      site {
        id
      }
      revision {
        media {
          __typename
          ... on GiphyMedia {
            url
            title
            width
            height
            still
            video
          }
          ... on TwitterMedia {
            url
            width
          }
          ... on YouTubeMedia {
            url
            width
            height
          }
        }
      }
    }
  `,
  settings: graphql`
    fragment MediaSectionContainer_settings on Settings {
      media {
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
})(MediaSectionContainer);

export default enhanced;
