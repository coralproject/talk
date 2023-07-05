import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { MediaLink } from "coral-common/helpers/findMediaLinks";
import {
  Button,
  Flex,
  HorizontalGutter,
  MatchMedia,
} from "coral-ui/components/v2";
import MediaConfirmationIcon from "./MediaConfirmationIcon";
import styles from "./MediaConfirmPrompt.css";

interface Props {
  media: MediaLink;
  onConfirm: () => void;
  onRemove: () => void;
}

const MediaConfirmPrompt: FunctionComponent<Props> = ({
  media,
  onConfirm,
  onRemove,
}) => {
  return (
    <div className={styles.root}>
      <MatchMedia gtWidth="xs">
        <div className={styles.icon}>
          <MediaConfirmationIcon media={media} />
        </div>
      </MatchMedia>
      <HorizontalGutter spacing={3}>
        <div className={styles.xsFlex}>
          <MatchMedia lteWidth="xs">
            <div className={styles.icon}>
              <MediaConfirmationIcon media={media} />
            </div>
          </MatchMedia>
          <div className={styles.promptContainer}>
            {media.type === "youtube" && (
              <p className={styles.prompt}>
                <Localized id="comments-postComment-confirmMedia-youtube">
                  Add this YouTube video to the end of your comment?
                </Localized>
              </p>
            )}
            {media.type === "twitter" && (
              <Localized id="comments-postComment-confirmMedia-twitter">
                <p className={styles.prompt}>
                  Add this tweet to the end of your comment?
                </p>
              </Localized>
            )}
            <p className={styles.url}>{media.url}</p>
          </div>
        </div>
        <Flex spacing={2} className={styles.buttons}>
          <Localized id="comments-postComment-confirmMedia-cancel">
            <Button
              color="mono"
              variant="outlined"
              className={styles.promptButton}
              onClick={onRemove}
            >
              Cancel
            </Button>
          </Localized>
          {media.type === "twitter" && (
            <Localized id="comments-postComment-confirmMedia-add-tweet">
              <Button
                color="mono"
                onClick={onConfirm}
                className={styles.promptButton}
              >
                Add tweet
              </Button>
            </Localized>
          )}
          {media.type === "youtube" && (
            <Localized id="comments-postComment-confirmMedia-add-video">
              <Button
                color="mono"
                onClick={onConfirm}
                className={styles.promptButton}
              >
                Add video
              </Button>
            </Localized>
          )}
        </Flex>
      </HorizontalGutter>
    </div>
  );
};

export default MediaConfirmPrompt;
