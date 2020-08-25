import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { MediaLink } from "coral-common/helpers/findMediaLinks";
import {
  ExternalMedia,
  TwitterMedia,
  YouTubeMedia,
} from "coral-stream/common/Media";
import {
  Flex,
  HorizontalGutter,
  Icon,
  MatchMedia,
} from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

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
  external: {
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
      <MatchMedia gteWidth="xs">
        {(matches) => (
          <>
            <HorizontalGutter spacing={3} className={styles.root}>
              <div>
                <Flex justifyContent="space-between" alignItems="center">
                  <Flex
                    spacing={2}
                    alignItems="baseline"
                    className={styles.link}
                  >
                    <div>
                      <MediaConfirmationIcon media={media} />
                    </div>
                    <div className={styles.url}>
                      <a
                        href={media.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {media.url}
                      </a>
                    </div>
                  </Flex>
                  {matches && (
                    <Button
                      onClick={onRemove}
                      color="secondary"
                      variant="flat"
                      paddingSize="extraSmall"
                    >
                      <Flex alignItems="flex-end" justifyContent="flex-end">
                        <Icon size="sm">close</Icon>
                        <Localized id="comments-postComment-confirmMedia-remove">
                          <span>Remove</span>
                        </Localized>
                      </Flex>
                    </Button>
                  )}
                </Flex>
              </div>
              {media.type === "external" && (
                <ExternalMedia url={media.url} siteID={siteID} />
              )}
              {media.type === "twitter" && (
                <TwitterMedia url={media.url} siteID={siteID} />
              )}
              {media.type === "youtube" && (
                <YouTubeMedia url={media.url} siteID={siteID} />
              )}
            </HorizontalGutter>
            {!matches && (
              <Flex justifyContent="center">
                <Button
                  onClick={onRemove}
                  color="secondary"
                  variant="flat"
                  paddingSize="extraSmall"
                  className={styles.removeButton}
                >
                  <Flex alignItems="flex-end">
                    <Icon size="sm">close</Icon>
                    <Localized id="comments-postComment-confirmMedia-remove">
                      <span>Remove</span>
                    </Localized>
                  </Flex>
                </Button>
              </Flex>
            )}
          </>
        )}
      </MatchMedia>
    </div>
  );
};

export default MediaPreview;
