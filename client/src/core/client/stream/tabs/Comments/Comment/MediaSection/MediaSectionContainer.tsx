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
import { Button, ButtonIcon, HorizontalGutter } from "coral-ui/components/v2";

import { MediaSectionContainer_comment } from "coral-stream/__generated__/MediaSectionContainer_comment.graphql";
import { MediaSectionContainer_settings } from "coral-stream/__generated__/MediaSectionContainer_settings.graphql";
import { MediaSectionContainerLocal } from "coral-stream/__generated__/MediaSectionContainerLocal.graphql";

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
    (media.__typename === "GiphyMedia" && !settings.media.giphy.enabled) ||
    (media.__typename === "ExternalMedia" && !settings.media.external.enabled)
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
        {media.__typename === "ExternalMedia" && (
          <Localized id="comments-embedLinks-show-external">
            Show image
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
          ... on TwitterMedia {
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
        youtube {
          enabled
        }
        giphy {
          enabled
        }
        external {
          enabled
        }
      }
    }
  `,
})(MediaSectionContainer);
export default enhanced;
