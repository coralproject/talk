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

interface Props {
  media: MediaLink;
  onRemove: () => void;
  siteID: string;
}

const RemoveButton: FunctionComponent<Pick<Props, "onRemove">> = ({
  onRemove,
}) => (
  <Button
    onClick={onRemove}
    color="secondary"
    variant="flat"
    paddingSize="extraSmall"
  >
    <Icon size="sm">close</Icon>
    <Localized id="comments-postComment-confirmMedia-remove">
      <span>Remove</span>
    </Localized>
  </Button>
);

const MediaPreview: FunctionComponent<Props> = ({
  media,
  onRemove,
  siteID,
}) => {
  return (
    <MatchMedia gteWidth="xs">
      {(matches) => (
        <>
          <HorizontalGutter spacing={3} className={styles.root}>
            <Flex justifyContent="space-between" alignItems="center">
              <Flex spacing={2} alignItems="baseline" className={styles.link}>
                <div>
                  <MediaConfirmationIcon media={media} />
                </div>
                <div className={styles.url}>
                  <a href={media.url} target="_blank" rel="noopener noreferrer">
                    {media.url}
                  </a>
                </div>
              </Flex>
              {matches && <RemoveButton onRemove={onRemove} />}
            </Flex>

            {/* Show the actual media. */}
            {media.type === "external" ? (
              <ExternalMedia url={media.url} siteID={siteID} />
            ) : media.type === "twitter" ? (
              <TwitterMedia url={media.url} siteID={siteID} />
            ) : media.type === "youtube" ? (
              <YouTubeMedia url={media.url} siteID={siteID} isToggled={true} />
            ) : null}
          </HorizontalGutter>

          {/* On extra small screens, move the remove button to the bottom! */}
          {!matches && (
            <Flex justifyContent="center" className={styles.removeButton}>
              <RemoveButton onRemove={onRemove} />
            </Flex>
          )}
        </>
      )}
    </MatchMedia>
  );
};

export default MediaPreview;
