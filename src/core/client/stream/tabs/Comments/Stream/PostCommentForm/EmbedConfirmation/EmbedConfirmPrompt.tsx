import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { EmbedLink } from "coral-common/utils/findEmbedLinks";
import {
  Button,
  Flex,
  HorizontalGutter,
  MatchMedia,
} from "coral-ui/components/v2";
import EmbedConfirmationIcon from "./EmbedConfirmationIcon";
import styles from "./EmbedConfirmPrompt.css";

interface Props {
  embed: EmbedLink;
  onConfirm: () => void;
  onRemove: () => void;
}

const EmbedConfirmPrompt: FunctionComponent<Props> = ({
  embed,
  onConfirm,
  onRemove,
}) => {
  return (
    <div className={styles.root}>
      <MatchMedia gtWidth="xs">
        <div className={styles.icon}>
          <EmbedConfirmationIcon embed={embed} />
        </div>
      </MatchMedia>
      <HorizontalGutter spacing={3}>
        <div className={styles.xsFlex}>
          <MatchMedia lteWidth="xs">
            <div className={styles.icon}>
              <EmbedConfirmationIcon embed={embed} />
            </div>
          </MatchMedia>
          <div className={styles.promptContainer}>
            {embed.source === "YOUTUBE" && (
              <Localized id="comments-postComment-confirmEmbed-youtube">
                <p className={styles.prompt}>
                  Add this YouTube video to the end of your comment?
                </p>
              </Localized>
            )}
            {embed.source === "TWITTER" && (
              <Localized id="comments-postComment-confirmEmbed-twitter">
                <p className={styles.prompt}>
                  Add this tweet to the end of your comment?
                </p>
              </Localized>
            )}
            <p className={styles.url}>{embed.url}</p>
          </div>
        </div>
        <Flex spacing={2} className={styles.buttons}>
          <Localized id="comments-postComment-confirmEmbed-cancel">
            <Button
              color="mono"
              variant="outline"
              className={styles.promptButton}
              onClick={onRemove}
            >
              Cancel
            </Button>
          </Localized>
          <Localized id="comments-postComment-confirmEmbed-add">
            <Button
              color="mono"
              onClick={onConfirm}
              className={styles.promptButton}
            >
              Add video
            </Button>
          </Localized>
        </Flex>
      </HorizontalGutter>
    </div>
  );
};

export default EmbedConfirmPrompt;
