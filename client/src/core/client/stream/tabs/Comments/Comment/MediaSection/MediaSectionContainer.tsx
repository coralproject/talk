import { Localized } from "@fluent/react/compat";
import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from "react";
import { graphql } from "react-relay";

import { useLocal, withFragmentContainer } from "coral-framework/lib/relay";
import {
  ExternalMedia,
  GiphyMedia,
  TwitterMedia,
  YouTubeMedia,
} from "coral-stream/common/Media";
import TenorMedia from "coral-stream/common/Media/TenorMedia";
import {
  AddIcon,
  ButtonSvgIcon,
  SubtractIcon,
} from "coral-ui/components/icons";
import { Button, HorizontalGutter } from "coral-ui/components/v2";

import { MediaSectionContainer_comment } from "coral-stream/__generated__/MediaSectionContainer_comment.graphql";
import { MediaSectionContainer_settings } from "coral-stream/__generated__/MediaSectionContainer_settings.graphql";
import { MediaSectionContainerLocal } from "coral-stream/__generated__/MediaSectionContainerLocal.graphql";

import BlueskyMedia from "coral-stream/common/Media/BlueskyMedia";
import styles from "./MediaSectionContainer.css";

interface Props {
  comment: MediaSectionContainer_comment;
  settings: MediaSectionContainer_settings;
  defaultExpanded?: boolean;
}
const MediaSectionContainer: FunctionComponent<Props> = ({
  comment,
  settings,
  defaultExpanded = false,
}) => {
  const [{ expandedMediaSettings }, setLocal] =
    useLocal<MediaSectionContainerLocal>(graphql`
      fragment MediaSectionContainerLocal on Local {
        expandedMediaSettings {
          commentIDs
        }
      }
    `);
  const [isToggled, setIsToggled] = useState(true);
  const onToggleExpand = useCallback(() => {
    const initialMediaSettings = expandedMediaSettings ?? { commentIDs: [] };
    const indexOfComment = initialMediaSettings.commentIDs.indexOf(comment.id);
    if (indexOfComment === -1) {
      setIsToggled(!defaultExpanded);
      setLocal({
        expandedMediaSettings: {
          commentIDs: initialMediaSettings.commentIDs.concat(comment.id),
        },
      });
    } else {
      setIsToggled(defaultExpanded);
      setLocal({
        expandedMediaSettings: {
          commentIDs: initialMediaSettings.commentIDs.filter(
            (c: string) => c !== comment.id
          ),
        },
      });
    }
  }, [comment, expandedMediaSettings, setLocal, setIsToggled, defaultExpanded]);

  const expanded = useMemo(() => {
    const commentInSettings = expandedMediaSettings?.commentIDs.includes(
      comment.id
    );
    return defaultExpanded ? !commentInSettings : commentInSettings;
  }, [expandedMediaSettings, comment, defaultExpanded]);

  const media = comment.revision?.media;
  if (!media) {
    return null;
  }
  if (
    (media.__typename === "TwitterMedia" && !settings.media.twitter.enabled) ||
    (media.__typename === "YouTubeMedia" && !settings.media.youtube.enabled) ||
    (media.__typename === "GiphyMedia" && !settings.media.gifs.enabled) ||
    (media.__typename === "ExternalMedia" &&
      !settings.media.external.enabled) ||
    (media.__typename === "BlueskyMedia" && !settings.media.bluesky.enabled)
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
        aria-expanded="false"
      >
        <ButtonSvgIcon Icon={AddIcon} size="xxs" className={styles.icon} />
        {media.__typename === "TwitterMedia" && (
          <Localized id="comments-embedLinks-show-twitter">Show post</Localized>
        )}
        {media.__typename === "BlueskyMedia" && (
          <Localized id="comments-embedLinks-show-bluesky">Show post</Localized>
        )}
        {media.__typename === "YouTubeMedia" && (
          <Localized id="comments-embedLinks-show-youtube">
            Show video
          </Localized>
        )}
        {media.__typename === "ExternalMedia" && (
          <Localized id="comments-embedLinks-show-external">
            Show image
          </Localized>
        )}
        {media.__typename === "GiphyMedia" && (
          <Localized id="comments-embedLinks-show-gif">Show GIF</Localized>
        )}
        {media.__typename === "TenorMedia" && (
          <Localized id="comments-embedLinks-show-gif">Show GIF</Localized>
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
          aria-expanded="true"
        >
          <ButtonSvgIcon
            Icon={SubtractIcon}
            size="xxs"
            className={styles.icon}
          />
          {media.__typename === "TwitterMedia" && (
            <Localized id="comments-embedLinks-hide-twitter">
              Hide post
            </Localized>
          )}
          {media.__typename === "BlueskyMedia" && (
            <Localized id="comments-embedLinks-hide-bluesky">
              Hide post
            </Localized>
          )}
          {media.__typename === "GiphyMedia" && (
            <Localized id="comments-embedLinks-hide-gif">Hide GIF</Localized>
          )}
          {media.__typename === "TenorMedia" && (
            <Localized id="comments-embedLinks-hide-gif">Hide GIF</Localized>
          )}
          {media.__typename === "YouTubeMedia" && (
            <Localized id="comments-embedLinks-hide-youtube">
              Hide video
            </Localized>
          )}
          {media.__typename === "ExternalMedia" && (
            <Localized id="comments-embedLinks-hide-external">
              Hide image
            </Localized>
          )}
        </Button>
      </div>
      {media.__typename === "ExternalMedia" && (
        <ExternalMedia
          id={comment.id}
          url={media.url}
          siteID={comment.site.id}
          isToggled={isToggled}
        />
      )}
      {media.__typename === "TwitterMedia" && (
        <TwitterMedia
          id={comment.id}
          url={media.url}
          siteID={comment.site.id}
          isToggled={isToggled}
        />
      )}
      {media.__typename === "BlueskyMedia" && (
        <BlueskyMedia
          id={comment.id}
          url={media.url}
          siteID={comment.site.id}
          isToggled={isToggled}
        />
      )}
      {media.__typename === "YouTubeMedia" && (
        <YouTubeMedia
          id={comment.id}
          url={media.url}
          siteID={comment.site.id}
          isToggled={isToggled}
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
      {media.__typename === "TenorMedia" && <TenorMedia url={media.url} />}
    </HorizontalGutter>
  );
};
const enhanced = withFragmentContainer<Props>({
  comment: graphql`
    fragment MediaSectionContainer_comment on Comment {
      id
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
          ... on TenorMedia {
            url
          }
          ... on TwitterMedia {
            url
            width
          }
          ... on BlueskyMedia {
            url
            width
          }
          ... on YouTubeMedia {
            url
            width
            height
          }
          ... on ExternalMedia {
            url
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
        bluesky {
          enabled
        }
        youtube {
          enabled
        }
        gifs {
          enabled
          provider
        }
        external {
          enabled
        }
      }
    }
  `,
})(MediaSectionContainer);
export default enhanced;
