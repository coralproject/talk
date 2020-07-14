import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { MediaLink } from "coral-common/helpers/findMediaLinks";
import { TwitterMedia, YouTubeMedia } from "coral-stream/common/Media";
import {
  Button,
  ButtonIcon,
  Flex,
  HorizontalGutter,
  MatchMedia,
} from "coral-ui/components/v2";

import MediaConfirmationIcon from "./MediaConfirmationIcon";

import styles from "./MediaPreview.css";
interface MediaConfig {
  giphy: {
    enabled: boolean;
  };
  twitter: {
    enabled: boolean;
  };
  youtube: {
    enabled: boolean;
  };
}

interface Props {
  media: MediaLink;
  onRemove: () => void;
  config: MediaConfig | null;
  siteID: string;
}

const MediaPreview: FunctionComponent<Props> = ({
  media,
  onRemove,
  config,
  siteID,
}) => {
  return (
    <div>
      <HorizontalGutter spacing={3} className={styles.root}>
        <div>
          <Flex justifyContent="space-between">
            <Flex spacing={2}>
              <div className={styles.icon}>
                <MediaConfirmationIcon media={media} />
              </div>
              <a
                href={media.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.url}
              >
                {media.url}
              </a>
            </Flex>
            <MatchMedia gteWidth="xs">
              <Localized id="comments-postComment-confirmMedia-remove">
                <Button onClick={onRemove} color="mono" variant="text" iconLeft>
                  <ButtonIcon>close</ButtonIcon>
                  Remove
                </Button>
              </Localized>
            </MatchMedia>
          </Flex>
        </div>
        {media.type === "twitter" && (
          <TwitterMedia url={media.url} siteID={siteID} />
        )}
        {media.type === "youtube" && (
          <YouTubeMedia url={media.url} siteID={siteID} />
        )}
      </HorizontalGutter>
      <MatchMedia ltWidth="xs">
        <Localized id="comments-postComment-confirmMedia-remove">
          <Button
            onClick={onRemove}
            color="mono"
            variant="text"
            iconLeft
            size="large"
            className={styles.removeButton}
          >
            <ButtonIcon>close</ButtonIcon>
            Remove
          </Button>
        </Localized>
      </MatchMedia>
    </div>
  );
};

export default MediaPreview;
